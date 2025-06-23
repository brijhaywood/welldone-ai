import React, { useState } from "react";
import { Button, Input, Select, Typography, message } from "antd";
import { submitCheckIn, fetchReflectionPrompt } from "../api";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Title } = Typography;
const { Option } = Select;

const moodOptions = [
  { label: "😩 Extremely Burned Out", value: 1 },
  { label: "😢 Drained", value: 2 },
  { label: "😞Sad", value: 3 },
  { label: "😕 Frustrated", value: 4 },
  { label: "😐 Neutral", value: 5 },
  { label: "🙂 Slightly Positive", value: 6 },
  { label: "😊 Good", value: 7 },
  { label: "😃 Happy", value: 8 },
  { label: "😁 Very Happy", value: 9 },
  { label: "🤩 Peak Energy", value: 10 },
  
];

const CheckIn = () => {
  const [moodRating, setMoodRating] = useState(null);
  const [excitedText, setExcitedText] = useState("");
  const [mustDoText, setMustDoText] = useState("");
  const [blockerText, setBlockerText] = useState("");
  const [loading, setLoading] = useState(false);

  const [burnoutScore, setBurnoutScore] = useState(null);
  const [burnoutLabel, setBurnoutLabel] = useState("");
  const [emotions, setEmotions] = useState({});
  const [taskCount, setTaskCount] = useState(null);
  const [nudge, setNudge] = useState("");
  const [reflectionPrompt, setReflectionPrompt] = useState("");
  const [reflectionResponse, setReflectionResponse] = useState("");
  

  const handleSubmit = async () => {
    if (!moodRating || !excitedText.trim() || !mustDoText.trim() || !blockerText.trim()) {
      message.warning("Please complete all fields.");
      return;
    }

    setLoading(true);

    const payload = {
      mood_rating: moodRating,
      journal_text: `
        Excited: ${excitedText}
        Must Do: ${mustDoText}
        Blockers: ${blockerText}
      `.trim(),
      timestamp: dayjs().toISOString(),
    };

    try {
      const res = await submitCheckIn(payload);
      const { burnout_score, emotions, task_count, nudge } = res.data;
    
      setBurnoutScore(burnout_score);
      setEmotions(emotions);
      setTaskCount(task_count);
      setNudge(nudge);
    
      if (burnout_score <= 20) setBurnoutLabel("Excellent 🔋");
      else if (burnout_score <= 40) setBurnoutLabel("Low Burnout 🌿");
      else if (burnout_score <= 60) setBurnoutLabel("Moderate Burnout ⚠️");
      else if (burnout_score <= 80) setBurnoutLabel("High Burnout 🔥");
      else setBurnoutLabel("Critical 🚨");
    
      message.success(`Check-in submitted! Burnout Score: ${burnout_score}/100`);
    } catch (err) {
      console.error(err);
      message.error("Check-in failed.");
    } finally {
      setLoading(false); 
    }
  };

  const handleMoodChange = async (value) => {
    setMoodRating(value);
    try {
      const res = await fetchReflectionPrompt(value);
      setReflectionPrompt(res.prompt);
    } catch (err) {
      console.error("Failed to fetch reflection prompt", err);
    }
  };

  return (
    <div 
    style={{ 
      maxWidth: "600px", 
      margin: "0 auto", 
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      writingMode: "horizontal-tb",
       }}>
      <Title level={3}>📝 Daily Check-In</Title>
      <Select
        placeholder="Select your mood"
        style={{ width: "100%", marginBottom: "1rem" }}
        onChange={handleMoodChange}
      >
        {moodOptions.map((opt) => (
          <Option key={opt.value} value={opt.value}>
            {opt.label}
          </Option>
        ))}
      </Select>
      {reflectionPrompt && (
        <div style={{ marginBottom: "1rem" }}>
          <p style={{ fontStyle: "italic", color: "#555" }}>
            💬 Reflection Prompt: "{reflectionPrompt}"
          </p>
          <TextArea
            placeholder="Write your reflection here..."
            rows={4}
            value={reflectionResponse}
            onChange={(e) => setReflectionResponse(e.target.value)}
            style={{ marginTop: "0.5rem" }}
          />
        </div>
      )}
      <TextArea
        placeholder="What is something you are excited to work on today?"
        rows={5}
        value={excitedText}
        onChange={(e) => setExcitedText(e.target.value)}
        style={{ marginBottom: "1rem" }}
      />
      <TextArea
        placeholder="What do you have to finish no matter what?"
        rows={5}
        value={mustDoText}
        onChange={(e) => setMustDoText(e.target.value)}
        style={{ marginBottom: "1rem" }}
      />
      <TextArea
        placeholder="Are there any blockers or challenges you're facing?"
        rows={5}
        value={blockerText}
        onChange={(e) => setBlockerText(e.target.value)}
        style={{ marginBottom: "1rem" }}
      />
      <Button
        type="primary"
        style={{ marginTop: "1rem" }}
        loading={loading}
        onClick={handleSubmit}
      >
        Submit
      </Button>
      {burnoutScore !== null && (
        <div style={{ marginTop: "2rem", backgroundColor: "#f0f2f5", padding: "1rem", borderRadius: "8px" }}>
          <Title level={4}>📊 Results</Title>
          <p><strong>Burnout Score:</strong> {burnoutScore}/100</p>
          <div style={{ height: 20, background: '#ddd', borderRadius: 10 }}>
              <div style={{
                width: `${burnoutScore}%`,
                height: '100%',
                background: burnoutScore < 40 ? '#4caf50' : burnoutScore < 70 ? '#ff9800' : '#f44336',
                borderRadius: 10
              }} />
            </div>
          <p><strong>Open Tasks:</strong> {taskCount}</p>

          <div>
            <strong>Detected Emotions:</strong>
            <ul>
              {Object.entries(emotions).map(([emotion, score]) => (
                <li key={emotion}>{emotion.charAt(0).toUpperCase() + emotion.slice(1)}: {Math.round(score * 100)}%</li>
              ))}
            </ul>
          </div>

          <p><strong>💡 AI Suggestion:</strong> {nudge}</p>
        </div>
      )}
    </div>
  );
};

export default CheckIn;

