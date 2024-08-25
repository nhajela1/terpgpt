import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  const data = await req.json();
  const text = data[data.length - 1].content;

  // Initialize Pinecone, OpenAI, and Supabase clients
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  const index = pc.index('rag').namespace('ns1');
  const openai = new OpenAI();
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

  // Process user query and fetch relevant reviews
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    encoding_format: 'float',
  });

  const results = await index.query({
    topK: 10,
    includeMetadata: true,
    vector: embedding.data[0].embedding,
  });

  // Format and fetch additional data
  let reviews = [];
  let professorNames = [];
  for (const match of results.matches) {
    // Fetch professor and course data from Supabase
    const { data: professorData, error: professorError } = await supabase
      .from('professors')
      .select('name, average_rating')
      .eq('slug', match.metadata?.slug)
      .single();

    if (professorError) {
      console.error('Error fetching professor data:', professorError);
      continue;
    }

    professorNames.push(professorData.name);

    const { data: courseData, error: courseError } = await supabase
      .from('professor-courses')
      .select('course')
      .eq('slug', match.metadata?.slug);

    if (courseError) {
      console.error('Error fetching course data:', courseError);
      continue;
    }

    const courses = courseData.map(course => course.course).join(', ');

    reviews.push({
      professor: professorData.name,
      expected_grade: match.metadata?.expected_grade,
      review: match.metadata?.review,
      average_rating: professorData.average_rating,
      courses: courses
    });
  }

  // Filter relevant professors
  const relevantProfessors = await filterRelevantProfessors(openai, text, professorNames);
  reviews = reviews.filter(review => relevantProfessors.includes(review.professor));
  reviews = reviews.slice(0, 5);

  return NextResponse.json({ reviews });
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