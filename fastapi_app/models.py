from pydantic import BaseModel
from typing import Optional

class MoodEntry(BaseModel):
    user_id: str
    timestamp: str  
    mood_rating: int  # 1-10 scale
    journal_text: Optional[str] = None
