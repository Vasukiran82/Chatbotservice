// src/constants/config.ts
import Constants from "expo-constants";

const expoExtra = (Constants.expoConfig || (Constants as any).manifest)?.extra || {};
// Allow either EXPO extra or process.env
const envUrl = (process.env as any).API_BASE_URL || (process.env as any).REACT_NATIVE_API_BASE;

const API_BASE =
  expoExtra.API_BASE_URL ||
  envUrl ||
  // default local backend (includes /api path for your chat route)
  "http://localhost:5001/api";

export const API_BASE_URL = API_BASE;
export const CHAT_ENDPOINT = `${API_BASE_URL}/chat`;

// small helper in case other modules need ecommerce endpoints
export const ECOM_ENDPOINT = `${API_BASE_URL.replace(/\/api$/, "")}/api/ecommerce`;
