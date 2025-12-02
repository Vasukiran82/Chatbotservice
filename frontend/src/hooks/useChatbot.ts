// hooks/useChatbot.ts
import { useState, useCallback } from 'react';
import { sendMessageToBot } from '../api/chatbotApi';

export const useChatbot = () => {
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: message, isUser: true }]);
    setLoading(true);

    try {
      // Send to backend
      const response = await sendMessageToBot(message, sessionId);
      
      // Update session ID if provided
      if (response.sessionId) {
        setSessionId(response.sessionId);
      }

      // Add bot response
      setMessages(prev => [...prev, { 
        text: response.reply, 
        isUser: false 
      }]);

    } catch (error: any) {
      // Add error message
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble responding right now. Please try again.", 
        isUser: false 
      }]);
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setSessionId('');
  }, []);

  return {
    messages,
    loading,
    sendMessage,
    clearChat,
    sessionId
  };
};