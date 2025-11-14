import { useState } from "react";
import { sendMessageToBot } from "../api/chatbotApi";

export function useChatbot() {
  const [messages, setMessages] = useState<{ from: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>();

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { from: "user", text }]);
    setLoading(true);

    try {
      const res = await sendMessageToBot(text, sessionId);
      setSessionId(res.sessionId);
      setMessages(prev => [...prev, { from: "bot", text: res.reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { from: "bot", text: "⚠️ Error contacting bot." }]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading };
}
