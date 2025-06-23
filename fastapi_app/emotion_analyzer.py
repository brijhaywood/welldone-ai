from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import numpy as np

class EmotionAnalyzer:
    def __init__(self):
        self.labels = [
            'admiration', 'amusement', 'anger', 'annoyance', 'approval',
            'caring', 'confusion', 'curiosity', 'desire', 'disappointment',
            'disapproval', 'disgust', 'embarrassment', 'excitement', 'fear',
            'gratitude', 'grief', 'joy', 'love', 'nervousness', 'optimism',
            'pride', 'realization', 'relief', 'remorse', 'sadness',
            'surprise', 'neutral'
        ]
        self.tokenizer = AutoTokenizer.from_pretrained("bhadresh-savani/bert-base-go-emotion")
        self.model = AutoModelForSequenceClassification.from_pretrained("bhadresh-savani/bert-base-go-emotion")

    def predict_emotions(self, text):
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True)
        outputs = self.model(**inputs)
        scores = torch.sigmoid(outputs.logits).detach().cpu().numpy()[0]

        print("Raw scores:", scores)

        results = {}
        for i, score in enumerate(scores):
            if score > 0.1:
                results[self.labels[i]] = float(score)

        print("Filtered emotions:", results)
        return results

    def calculate_burnout_score(self, emotions, mood_rating):
        burnout_flags = {
            "disappointment": 1.2,
            "sadness": 1.2,
            "annoyance": 1.1,
            "anger": 1.3,
            "disapproval": 1.1,
            "nervousness": 1.2,
            "fear": 1.3,
            "grief": 1.5,
            "embarrassment": 1.1,
        }

        # Burnout increases when mood rating is low
        mood_penalty = (10 - mood_rating) * 5

        # Score burnout-heavy emotions more
        emotion_penalty = 0
        for emotion, score in emotions.items():
            weight = burnout_flags.get(emotion.lower(), 1.0)
            emotion_penalty += score * weight * 40

        emotion_penalty = min(emotion_penalty, 60)
        burnout_score = int(min(mood_penalty + emotion_penalty, 100))

        print("Mood penalty:", mood_penalty)
        print("Emotion penalty:", emotion_penalty)
        print("Final burnout score:", burnout_score)

        return burnout_score
