import axios from 'axios';

const api = axios.create({ baseURL: 'https://quiz-app-backend-k92b.onrender.com/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const uploadQuiz = (formData, onProgress) =>
  api.post('/quiz/upload', formData, {
    onUploadProgress: onProgress,
  });

export const getQuiz = (shareId) => api.get(`/quiz/${shareId}`);

export const submitQuiz = (shareId, payload) =>
  api.post(`/quiz/${shareId}/submit`, payload);

export const generateAdaptiveRetake = (shareId, attemptId) =>
  api.post(`/quiz/${shareId}/adaptive-retake`, { attemptId });

export const getLeaderboard = (shareId) =>
  api.get(`/quiz/${shareId}/leaderboard`);

// Explore Hub
export const getExploreTopics = () => api.get('/explore/topics');
export const getExploreQuizzes = (params) => api.get('/explore/quizzes', { params });

// AI Study Notes & Flashcards
export const generateStudyNotes = (shareId) => api.post('/notes/generate', { shareId });
export const getStudyNotes = (shareId) => api.get(`/notes/${shareId}`);
export const updateFlashcardMastery = (shareId, cardId, masteryLevel) =>
  api.put(`/notes/${shareId}/flashcard`, { cardId, masteryLevel });

// AI Resume & Interview Simulator
export const uploadInterviewResume = (formData) => api.post('/interview/upload', formData);
export const getInterviewSession = (shareId) => api.get(`/interview/${shareId}`);
export const submitInterviewSession = (shareId, responses) =>
  api.post(`/interview/${shareId}/submit`, { responses });

export default api;
