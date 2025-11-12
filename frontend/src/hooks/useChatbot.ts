import { useState } from 'react';
import { sendMessageToBot } from '../api/chatbotAPI';
import { ChatMessage } from '../types/chatbot';

export const useChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    const userMessage: ChatMessage = { sender: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const botReply = await sendMessageToBot(text);
      setMessages(prev => [...prev, botReply]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: 'Error: Could not connect to server.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, sendMessage };
};
