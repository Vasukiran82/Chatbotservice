// src/store/useChatStore.ts
import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import { IMessage } from "react-native-gifted-chat";

const API_URL = Constants.expoConfig?.extra?.apiUrl || "http://192.168.1.100:5001";

const api = axios.create({
    baseURL: `${API_URL}/api/chat`,
});

interface ChatState {
    messages: IMessage[];
    sessionId: string | null;
    isTyping: boolean;
    sendMessage: (text: string) => Promise<void>;
    loadHistory: () => Promise<void>;
}

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            messages: [],
            sessionId: null,
            isTyping: false,

            loadHistory: async () => {
                const { sessionId } = get();
                if (!sessionId) return;

                try {
                    const { data } = await api.get(`/history/${sessionId}`);
                    const msgs = data.data.messages
                        .reverse()
                        .map((m: any, i: number) => ({
                            _id: Date.now() + i,
                            text: m.content,
                            createdAt: new Date(m.timestamp),
                            user: { _id: m.role === "bot" ? 2 : 1 },
                        }));
                    set({ messages: msgs });
                } catch (error: any) {
                    if (error.response?.status !== 404) {
                        console.error("Failed to load history:", error);
                    }
                }
            },

            sendMessage: async (text: string) => {
                const userMsg: IMessage = {
                    _id: Date.now().toString(),
                    text,
                    createdAt: new Date(),
                    user: { _id: 1 },
                };

                set((state) => ({
                    messages: [userMsg, ...state.messages],
                    isTyping: true,
                }));

                try {
                    const { sessionId } = get();
                    const res = await api.post("/message", {
                        message: text.trim(),
                        sessionId: sessionId || undefined,
                    });

                    const botData = res.data.data;

                    if (!sessionId && botData.sessionId) {
                        set({ sessionId: botData.sessionId });
                    }

                    const botMsg: IMessage = {
                        _id: (Date.now() + 1).toString(),
                        text: botData.response,
                        createdAt: new Date(),
                        user: { _id: 2 },
                    };

                    set((state) => ({
                        messages: [botMsg, ...state.messages],
                        isTyping: false,
                    }));
                } catch (error: any) {
                    console.error("Send message error:", error);
                    set({ isTyping: false });

                    const errorMsg: IMessage = {
                        _id: Date.now().toString(),
                        text: "Sorry, I'm having trouble connecting. Please try again.",
                        createdAt: new Date(),
                        user: { _id: 2 },
                    };
                    set((state) => ({
                        messages: [errorMsg, ...state.messages],
                    }));
                }
            },
        }),
        {
            name: "chat-storage",
            partialize: (state) => ({ sessionId: state.sessionId } as Partial<ChatState>),
            storage: {
                getItem: async (name): Promise<any> => {
                    const value = await AsyncStorage.getItem(name);
                    return value ? JSON.parse(value) : null;
                },
                setItem: async (name, value) => {
                    await AsyncStorage.setItem(name, JSON.stringify(value));
                },
                removeItem: async (name) => {
                    await AsyncStorage.removeItem(name);
                },
            },
        } as PersistOptions<ChatState, Partial<ChatState>>
    )
);
