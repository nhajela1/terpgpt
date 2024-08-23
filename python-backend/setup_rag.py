from dotenv import load_dotenv
load_dotenv()
from pinecone import Pinecone, ServerlessSpec
from openai import OpenAI
import os
import json
from database import get_reviews




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



for page in range(32):
    # Load the review data
    data = get_reviews(page)
    #data returns { id: int, slug: str, review: str, expected_grade: str } as list

    # Create embeddings for each review
    for review in data:
        try:
            response = client.embeddings.create(
                input=review['review'], model="text-embedding-3-small"
            )
            embedding = response.data[0].embedding

            processed_data = [
                {
                    "values": embedding,
                    "id": str(review["id"]),
                    "metadata":{
                        "review": review["review"],
                        "slug": review["slug"],
                        "expected_grade": review["expected_grade"],
                    }
                }
            ]

            upsert_response = index.upsert(
                vectors=processed_data,
                namespace="ns1",
            )
            print(f"Upserted count: {upsert_response['upserted_count']}")
        except Exception as e:
            print(str(e))


# Print index statistics
print(index.describe_index_stats())