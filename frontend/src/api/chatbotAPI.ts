import axios from 'axios';
import { ChatMessage } from '../types/chatbot';

const API_BASE_URL = 'http://localhost:5000/api'; // adjust backend URL

export const sendMessageToBot = async (message: string): Promise<ChatMessage> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chat`, { message });
    return response.data;
  } catch (error) {
    console.error('Chatbot API Error:', error);
    throw error;
  }
};
