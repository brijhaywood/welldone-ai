from fastapi import FastAPI
from models import MoodEntry
from pydantic import BaseModel
from datetime import datetime
from services import insert_mood_entry, get_task_count, mood_collection
from emotion_analyzer import EmotionAnalyzer
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
analyzer = EmotionAnalyzer()


client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class MoodInput(BaseModel):
    mood_rating: int

@app.post("/reflection-prompt")
def generate_prompt(data: MoodInput):
    prompt = f"Generate a short reflection prompt for someone feeling a mood rated {data.mood_rating}/10."

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=60,
        temperature=0.7
    )

    message = response.choices[0].message.content.strip()
    return {"prompt": message}

@app.get("/")
async def root():
    return {"message": "Developer Burnout AI is running!"}

@app.post("/checkin")
async def checkin(entry: MoodEntry):
    entry_dict = entry.dict()
    entry_dict["timestamp"] = datetime.utcnow().isoformat()

    emotions = {}
    mood_rating = entry.mood_rating
    burnout_score = 0

    if entry.journal_text:
        emotions = analyzer.predict_emotions(entry.journal_text)
        burnout_score = analyzer.calculate_burnout_score(emotions, mood_rating)

    task_count = get_task_count(entry.user_id)

    burnout_score += int(task_count * 2)  # +2 burnout per open task
    burnout_score = min(burnout_score, 100)  # Cap at 100

    entry_dict["emotions"] = emotions
    entry_dict["burnout_score"] = burnout_score
    entry_dict["task_count"] = task_count

    inserted_id = insert_mood_entry(entry_dict)

    return {
        "inserted_id": inserted_id,
        "burnout_score": burnout_score,
        "emotions": emotions,
        "task_count": task_count,
        "nudge": get_nudge(burnout_score)
    }

@app.get("/mood_entries")
def get_mood_entries(user_id: str):
    entries = list(mood_collection.find({"user_id": user_id}))
    for e in entries:
        e["_id"] = str(e["_id"])
    return entries

def get_nudge(burnout_score):
    if burnout_score < 30:
        return "You're doing great! ✅ Keep riding this wave of energy by staying aligned with your priorities and taking short breaks to maintain momentum. Keep listening to your body and celebrate the small wins!"
    elif burnout_score < 60:
        return "You're managing well, but don't forget to recharge. ☕ Try a 5–10 minute break — stretch, get fresh air, or hydrate. You're allowed to slow down to speed up. Remember, rest is part of productivity."
    elif burnout_score < 80:
        return "You're pushing close to your limits. 🔧 Prioritize your top tasks and consider deferring or delegating what can wait. Reflect on what’s draining you today. You deserve breathing room — take it if you can."
    else:
        return "You may be on the edge of burnout. 🚨 Please take this seriously. Close the laptop if you can, even for 30 minutes. Step outside, call a friend, or just sit in silence. Nothing is more urgent than your well-being. You matter more than your output."
