import axios from "axios";

const userId = localStorage.getItem("user_id") || "demo";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const submitCheckIn = async (payload) => {
  const completePayload = {
    ...payload,
    user_id: userId,
  };
  return await api.post("/checkin", completePayload);
};

export const fetchReflectionPrompt = async (moodRating) => {
  const res = await fetch("http://127.0.0.1:8000/reflection-prompt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mood_rating: moodRating }),
  });

  if (!res.ok) throw new Error("Failed to fetch prompt");
  return await res.json();
};

export const getTasks = async () => {
  return await api.get(`/tasks/${userId}`);
};

export const addTask = async (task) => {
  return await api.post("/tasks", { ...task, user_id: userId });
};

export const updateTask = async (task_id, newStatus) => {
  return await api.put(`/tasks/${task_id}`, {
    status: newStatus,
  });
};

export const deleteTask = async (task_id) => {
  return await api.delete(`/tasks/${task_id}`);
};
