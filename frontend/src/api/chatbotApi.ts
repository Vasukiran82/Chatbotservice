import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export type ChatResponse = {
  success: boolean;
  reply: string;
  sessionId?: string;
};

export const testConnection = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health', { timeout: 5000 });
    console.log('Backend OK:', response.data);
    return true;
  } catch (err) {
    console.log('Backend unavailable');
    return false;
  }
};

export const sendMessageToBot = async (
  message: string,
  sessionId?: string
): Promise<ChatResponse> => {
  try {
    const response = await api.post('/chat/message', {
      message: message.trim(),
      sessionId: sessionId || `session_${Date.now()}`,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) throw new Error(error.response.data.message || 'Server error');
    if (error.request) throw new Error(`Backend not reachable at ${API_BASE_URL}`);
    throw new Error(error.message);
  }
};
