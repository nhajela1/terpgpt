"use server"

import { NextResponse } from 'next/server'
import { Pinecone } from '@pinecone-database/pinecone'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

const systemPrompt = `
You are a UMD agent called TerpGPT trained to help students answer questions about professors and courses.
For every user question, the top 5 results that match the user question are returned.
Use them to answer the question if needed. Your answer should always be specifc to UMD.
`

async function extractQueryInfo(openai: OpenAI, query: string): Promise<{ professorName: string | null, courseNumber: string | null, queryType: 'professor' | 'course' | 'both' }> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Extract the professor\'s name and course number from the query. Return a JSON object with "professorName" and "courseNumber" fields. If either is not mentioned, set the respective field to null.' },
      { role: 'user', content: query }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });
  const extractedInfo = JSON.parse(response.choices[0].message.content || '{}');
  const professorName = extractedInfo.professorName?.trim() || null;
  const courseNumber = extractedInfo.courseNumber?.trim() || null;
  const queryType = professorName && courseNumber ? 'both' : (professorName ? 'professor' : (courseNumber ? 'course' : 'both'));
  return { professorName, courseNumber, queryType };
}

async function filterRelevantProfessors(openai: OpenAI, query: string, professors: string[]): Promise<string[]> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Given a user query and a list of professors, return a JSON object with a "relevant_professors" field containing the only professors that are relevant to the query. If no specific professor is mentioned or all are relevant, include all professors in the array.' },
      { role: 'user', content: `Query: ${query}\nProfessors: ${professors.join(', ')}` }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  })

  const relevantProfessors = JSON.parse(response.choices[0].message.content || '{}').relevant_professors || []
  return relevantProfessors
}

async function filterRelevantCourses(openai: OpenAI, query: string, courses: string[]): Promise<string[]> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Given a user query and a list of courses, return a JSON object with a "relevant_courses" field containing only the courses that are relevant to the query. If no specific course is mentioned or all are relevant, include all courses in the array.' },
      { role: 'user', content: `Query: ${query}\nCourses: ${courses.join(', ')}` }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  })

  const relevantCourses = JSON.parse(response.choices[0].message.content || '{}').relevant_courses || []
  return relevantCourses
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
    const professorIndex = pc.index('rag').namespace('ns1')
    const courseIndex = pc.index('rag').namespace('courses')
    const openai = new OpenAI()

    // Initialize Supabase client
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

    const text = data[data.length - 1].content
    const { professorName, courseNumber, queryType } = await extractQueryInfo(openai, text)

    // Process user query
    const embedding = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float',
    })

    // Query Pinecone for the top 10 results that match the user query
    let results;
    if (queryType === 'professor' || queryType === 'both') {
        results = await professorIndex.query({
            topK: 10,
            includeMetadata: true,
            vector: embedding.data[0].embedding,
        })
    } else if (queryType === 'course') {
        results = await courseIndex.query({
            topK: 10,
            includeMetadata: true,
            vector: embedding.data[0].embedding,
        })
    } else {
        const professorResults = await professorIndex.query({
            topK: 5,
            includeMetadata: true,
            vector: embedding.data[0].embedding,
        })
        const courseResults = await courseIndex.query({
            topK: 5,
            includeMetadata: true,
            vector: embedding.data[0].embedding,
        })
        results = {
            matches: [...professorResults.matches, ...courseResults.matches]
        }
    }

    // Format the results and fetch additional data from Supabase
    let reviews = []
    let professorNames = []
    let courseInfo = []
    for (const match of results.matches) {
        if (match.metadata?.slug) {
            // This is professor data
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
        } else {
            // This is course data
            courseInfo.push({
                average_gpa: match.metadata?.average_gpa,
                course_number: match.metadata?.course_number,
                credits: match.metadata?.credits,
                department: match.metadata?.department,
                description: match.metadata?.description,
                professors: match.metadata?.professors,
                title: match.metadata?.title
            })
        }
    }

    // Filter relevant professors using LLM
    const relevantProfessors = await filterRelevantProfessors(openai, text, professorNames)

    // Filter reviews based on relevant professors
    reviews = reviews.filter(review => relevantProfessors.includes(review.professor))

    // Filter relevant courses using LLM
    const relevantCourses = await filterRelevantCourses(openai, text, courseInfo.map(course => `${course.department} ${course.course_number}`))

    // Filter courseInfo based on relevant courses
    courseInfo = courseInfo.filter(course => relevantCourses.includes(`${course.department} ${course.course_number}`))

    // Limit the reviews to 5 if we have more than that after filtering
    reviews = reviews.slice(0, 5)

    // Append the results to the last message
    const lastMessage = data[data.length - 1]
    const lastMessageContent = lastMessage.content + JSON.stringify({reviews, courseInfo})
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
        
        // Send the reviews and courseInfo first
        controller.enqueue(encoder.encode(JSON.stringify({reviews, courseInfo})))
        
        // Then stream the chat completion
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