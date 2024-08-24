import os
from supabase import create_client, Client

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_ANON_KEY")

client: Client = create_client(url, key)


def get_reviews(page = 0):
    max_limit = 1000
    response = client.table("professor-reviews").select("*").limit(max_limit).offset(page * max_limit).execute()
    return response.data

def get_courses(page = 0):
    max_limit = 1000
    response = client.table("courses").select('*').limit(max_limit).offset(page * max_limit).execute()
    return response.data

