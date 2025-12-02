// src/components/ChatScreen.tsx
import React, { useEffect } from "react";
import {
    GiftedChat,
    Bubble,
    Send,
    InputToolbar,
    IMessage,
} from "react-native-gifted-chat";
import {
    View,
    StyleSheet,
    Platform,
    Text,
} from "react-native";
import { useChatStore } from "../store/useChatStore";

// DO NOT import react-native-vector-icons at all on web
// Use Expo's built-in icons instead — they work everywhere!
import { MaterialIcons } from "@expo/vector-icons";

export default function ChatScreen() {
    const { messages, sendMessage, isTyping, sessionId, loadHistory } =
        useChatStore();

    useEffect(() => {
        if (sessionId) loadHistory();
    }, [sessionId]);

    return (
        <View style={styles.container}>
            <GiftedChat
                messages={messages}
                onSend={(messages) => sendMessage(messages[0].text)}
                user={{ _id: 1 }}
                placeholder="Ask about your order..."
                isTyping={isTyping}
                renderBubble={(props) => (
                    <Bubble
                        {...props}
                        wrapperStyle={{
                            left: { backgroundColor: "#f0f0f0" },
                            right: { backgroundColor: "#007AFF" },
                        }}
                        textStyle={{
                            left: { color: "#000" },
                            right: { color: "#fff" },
                        }}
                    />
                )}
                renderSend={(props) => (
                    <Send {...props} containerStyle={styles.sendBtn}>
                        {/* Works on iOS, Android, AND Web */}
                        <MaterialIcons name="send" size={24} color="#007AFF" />
                    </Send>
                )}
                renderInputToolbar={(props) => (
                    <InputToolbar {...props} containerStyle={styles.inputBar} />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    sendBtn: {
        justifyContent: "center",
        paddingHorizontal: 12,
        paddingRight: 16,
    },
    inputBar: {
        borderTopWidth: 1,
        borderTopColor: "#ddd",
    },
});
