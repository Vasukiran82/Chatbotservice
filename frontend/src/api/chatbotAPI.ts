// src/api/chatbotApi.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api/chat';

// Create axios instance with better error handling
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type ChatResponse = {
  success: boolean;
  reply: string;
  sessionId?: string;
  confidence?: number;
  intent?: string;
  entities?: Record<string, any>;
  message?: string;
};

// Test backend connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const response = await axios.get('http://localhost:5001/health', { timeout: 5000 });
    console.log('✅ Backend connection test passed');
    return true;
  } catch (error) {
    console.log('❌ Backend connection test failed');
    return false;
  }
};

export const sendMessageToBot = async (
  message: string, 
  sessionId?: string
): Promise<ChatResponse> => {
  try {
    console.log('🔄 Sending message to backend...');
    
    const response = await api.post('/chat', {
      message: message.trim(),
      sessionId: sessionId || `session_${Date.now()}`,
    });

    console.log('✅ Backend response received:', response.data);
    return response.data;

  } catch (error: any) {
    console.error('❌ API Error details:');
    console.error('   - Error code:', error.code);
    console.error('   - Error message:', error.message);
    
    if (error.response) {
      // Server responded with error status
      console.error('   - Server response status:', error.response.status);
      console.error('   - Server response data:', error.response.data);
      throw new Error(`Server error: ${error.response.data.message || error.response.status}`);
    } else if (error.request) {
      // Request was made but no response received
      console.error('   - No response received from server');
      throw new Error('Cannot connect to chatbot server. Please make sure the backend is running on http://localhost:5001');
    } else {
      // Something else happened
      throw new Error(error.message || 'Unknown error occurred');
    }
  }
};