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
    // Process user query
    const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    encoding_format: 'float',
    })

    // Query Pinecone for the top 5 results that match the user query
    const results = await index.query({
        topK: 5,
        includeMetadata: true,
        vector: embedding.data[0].embedding,
    })

    // Format the results and fetch additional data from Supabase
    let reviews = []
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