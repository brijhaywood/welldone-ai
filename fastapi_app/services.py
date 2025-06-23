import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

client = MongoClient(MONGODB_URI)
db = client[DATABASE_NAME]

# Collection
mood_collection = db["mood_entries"]
tasks_collection = db["tasks"]
statuses = ["To Do", "In Progress", "Done"]

def insert_mood_entry(entry: dict):
    result = mood_collection.insert_one(entry)
    return str(result.inserted_id)

def get_task_count(user_id):
    tasks_collection = db["tasks"]
    return tasks_collection.count_documents({"user_id": user_id})
