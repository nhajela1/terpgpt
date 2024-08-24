from dotenv import load_dotenv
load_dotenv()
from pinecone import Pinecone, ServerlessSpec
from openai import OpenAI
import os
import json
from database import get_courses, get_reviews




# Initialize Pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# Create a Pinecone index
'''

pc.create_index(
    name="rag",
    dimension=1536,
    metric="cosine",
    spec=ServerlessSpec(cloud="aws", region="us-east-1"),
)

'''
client = OpenAI()
# Insert the embeddings into the Pinecone index
index = pc.Index("rag")



for page in range(17):
    # Load the review data
    data = get_courses(page)
    #data returns { id: int, slug: str, review: str, expected_grade: str } as list

    # Create embeddings for each review
        
    '''
    try:

        processed_data = [
            {
                "values": (lambda text: client.embeddings.create(input=text, model="text-embedding-3-small").data[0].embedding)(
                    f"{course['title']} ({course['department']} {course['course_number']}): {course['description']} taught by Professors {', '.join(course['professors'])}".replace('\n', ' ')
                ),
                "id": str(course["id"]),
                "metadata": {
                    "title": course["title"],
                    "department": course["department"],
                    "course_number": course["course_number"],
                    "description": course["description"],
                    "professors": course["professors"],
                    "credits": course["credits"],
                    "average_gpa": course["average_gpa"]
                }
            } for course in data
        ]

        upsert_response = index.upsert(
            vectors=processed_data,
            namespace="courses",
        )
        print(f"Upserted count: {upsert_response['upserted_count']}")
    except Exception as e:
        print(str(e))
    '''


    for course in data:
        input_text = f'''
            {course['title']} (${course['department']} {course['course_number']}): {course["description"]}
            taught by Professors {', '.join(course['professors'])}'''.replace('\n', ' ')

        try:
            response = client.embeddings.create(
                input=input_text, model="text-embedding-3-small"
            )
            embedding = response.data[0].embedding

            processed_data = [
                {
                    "values": embedding,
                    "id": str(course["id"]),
                    "metadata":{
                        "title": course["title"] or "",
                        "department": course["department"] or "",
                        "course_number": course["course_number"] or 0.0,
                        "description": course["description"] or "",
                        "professors": course["professors"] or [],
                        "credits": course["credits"] or 0.0,
                        "average_gpa": course["average_gpa"] or 0.0                    
                    }
                }
            ]

            upsert_response = index.upsert(
                vectors=processed_data,
                namespace="courses",
            )
            print(f"Upserted count: {upsert_response['upserted_count']}")
        except Exception as e:
            print(str(e))
    '''
    '''

# Print index statistics
print(index.describe_index_stats())