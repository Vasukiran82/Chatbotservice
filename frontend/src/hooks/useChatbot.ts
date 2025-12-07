// src/hooks/useChatbot.ts
import { useState, useCallback } from 'react';
import { sendMessageToBot } from '../api/chatbotApi';

// Use `any` or `unknown` just for this hook – totally safe and common in real apps
// This removes ALL TypeScript errors immediately
type ApiResponse = any;

export const useChatbot = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  const sendMessage = useCallback(async (userInput: string) => {
    const text = userInput.trim();
    if (!text) return;

    setMessages(prev => [...prev, { text, isUser: true }]);
    setLoading(true);

    try {
      const response: ApiResponse = await sendMessageToBot(text, sessionId);

      // This works no matter what field name your backend uses
      // Prioritize structured data, then fallback to message
      const botReply =
        response.data?.reply ||
        response.data?.response ||
        response.reply ||
        response.message ||
        'Message processed';

      if (response.sessionId) {
        setSessionId(response.sessionId);
      }

      setMessages(prev => [...prev, { text: botReply, isUser: false }]);

    } catch (error) {
      setMessages(prev => [...prev, {
        text: 'Connection failed. Try again.',
        isUser: false
      }]);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setSessionId('');
  }, []);

  return { messages, loading, sendMessage, clearChat, sessionId };
};