import axios from "axios";
import { API_BASE_URL } from "../constants/config";

export const sendMessageToBot = async (message: string, sessionId?: string) => {
  const res = await axios.post(`${API_BASE_URL}/api/chat`, { message, sessionId });
  return res.data;
};
