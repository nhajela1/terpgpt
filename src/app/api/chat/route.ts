"use server"

import { NextResponse } from 'next/server'
import { Pinecone } from '@pinecone-database/pinecone'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

const systemPrompt = `
You are a rate my professor agent to help students find classes, that takes in user questions and answers them.
For every user question, the top 5 results that match the user question are returned.
Use them to answer the question if needed.
`

async function extractProfessorName(openai: OpenAI, query: string): Promise<string | null> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Extract the professor\'s name from the query. Return a JSON object with a "name" field. If no name is mentioned, set the "name" field to "None".' },
      { role: 'user', content: query }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  })
  const extractedName = JSON.parse(response.choices[0].message.content || '{}').name?.trim() || null;
  return extractedName === 'None' ? null : extractedName;
}

async function filterRelevantProfessors(openai: OpenAI, query: string, professors: string[]): Promise<string[]> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Given a user query and a list of professors, return a JSON object with a "relevant_professors" field containing an array of professor names that are relevant to the query. If no specific professor is mentioned or all are relevant, include all professors in the array.' },
      { role: 'user', content: `Query: ${query}\nProfessors: ${professors.join(', ')}` }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  })

  const relevantProfessors = JSON.parse(response.choices[0].message.content || '{}').relevant_professors || []
  return relevantProfessors
}

export async function POST(req: Request) {
    // Initialize Pinecone and OpenAI
    const data = await req.json()
    const apiKey = process.env.PINECONE_API_KEY;
    if (!apiKey) {
        throw new Error("Pinecone API key is not defined");
    }
    const pc = new Pinecone({
        apiKey: apiKey,
    })
    const index = pc.index('rag').namespace('ns1')
    const openai = new OpenAI()

    // Initialize Supabase client
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

    const text = data[data.length - 1].content
    const professorName = await extractProfessorName(openai, text)

    // Process user query
    const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    encoding_format: 'float',
    })

    // Query Pinecone for the top 5 results that match the user query
    const results = await index.query({
        topK: 10, // Increase to 10 to have more results to filter from
        includeMetadata: true,
        vector: embedding.data[0].embedding,
    })

    // Format the results and fetch additional data from Supabase
    let reviews = []
    let professorNames = []
    for (const match of results.matches) {
        const { data: professorData, error: professorError } = await supabase
            .from('professors')
            .select('name, average_rating')
            .eq('slug', match.metadata?.slug)
            .single()

        if (professorError) {
            console.error('Error fetching professor data:', professorError)
            continue
        }

        professorNames.push(professorData.name)

        const { data: courseData, error: courseError } = await supabase
            .from('professor-courses')
            .select('course')
            .eq('slug', match.metadata?.slug)

        if (courseError) {
            console.error('Error fetching course data:', courseError)
            continue
        }

        const courses = courseData.map(course => course.course).join(', ')

        reviews.push({
            professor: professorData.name,
            expected_grade: match.metadata?.expected_grade,
            review: match.metadata?.review,
            average_rating: professorData.average_rating,
            courses: courses
        })
    }

    // Filter relevant professors using LLM
    const relevantProfessors = await filterRelevantProfessors(openai, text, professorNames)

    // Filter reviews based on relevant professors
    reviews = reviews.filter(review => relevantProfessors.includes(review.professor))

    // Limit the reviews to 5 if we have more than that after filtering
    reviews = reviews.slice(0, 5)

    // Append the results to the last message
    const lastMessage = data[data.length - 1]
    const lastMessageContent = lastMessage.content + JSON.stringify(reviews)
    const lastDataWithoutLastMessage = data.slice(0, data.length - 1)

    // Create the chat completion
    const completion = await openai.chat.completions.create({
        messages: [
          {role: 'system', content: systemPrompt},
          ...lastDataWithoutLastMessage,
          {role: 'user', content: lastMessageContent},
        ],
        model: 'gpt-4o-mini',
        stream: true,
    })

    // Stream the results
    const stream = new ReadableStream({
    async start(controller) {
        const encoder = new TextEncoder()
        controller.enqueue(encoder.encode(JSON.stringify({reviews})))
        try {
        for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content
            if (content) {
            const text = encoder.encode(content)
            controller.enqueue(text)
            }
        }
        } catch (err) {
        controller.error(err)
        } finally {
        controller.close()
        }
    },
    })
    return new NextResponse(stream)
}