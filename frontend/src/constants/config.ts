// src/constants/config.ts
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const expoExtra = (Constants.expoConfig || (Constants as any).manifest)?.extra || {};

const LOCAL_IP = '192.168.1.100'; // <-- replace with your PC LAN IP

export const API_BASE_URL = Platform.select({
  web: 'http://localhost:5001/api',       // works for web
  default: `http://${LOCAL_IP}:5001/api`  // works for mobile (iOS/Android)
});

export const CHAT_ENDPOINT = `${API_BASE_URL}/chat`;
export const ECOM_ENDPOINT = `${API_BASE_URL.replace(/\/api$/, '')}/api/ecommerce`;
