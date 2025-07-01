// services/api.js

import axios from "axios";

// Define the backend base URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// Create axios instance with baseURL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// All clipboard-related API calls
export const clipboardAPI = {
  // Create new clipboard
  createClipboard: async (clipId, password) => {
    console.log("🚀 Sending:", { clipId, password });
    try {
      const res = await api.post("/clipboards/create", {
        clipId,
        password,
      });
      console.log("Received:", res.data);
      return res.data;
    } catch (err) {
      console.error("API ERROR:", err.response?.data || err.message);
      throw err;
    }
  },

  // Verify clipboard
  verifyClipboard: async (clipId, password) => {
    const res = await api.post(`/clipboards/${clipId}/verify`, { password });
    return res.data;
  },

  // Get clipboard data
  getClipboard: async (clipId) => {
    const res = await api.get(`/clipboards/${clipId}`);
    return res.data;
  },

  // Add note
  addNote: async (clipId, content) => {
    const res = await api.post(`/clipboards/${clipId}/notes`, { content });
    return res.data;
  },

  // Update note
  updateNote: async (clipId, noteId, content) => {
    const res = await api.put(`/clipboards/${clipId}/notes/${noteId}`, {
      content,
    });
    return res.data;
  },

  // Delete note
  deleteNote: async (clipId, noteId) => {
    const res = await api.delete(`/clipboards/${clipId}/notes/${noteId}`);
    return res.data;
  },
};

export default api;
