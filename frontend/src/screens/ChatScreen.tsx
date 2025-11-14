import React from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { ChatBubble } from "../components/ChatBubble";
import { MessageInput } from "../components/MessageInput";
import { useChatbot } from "../hooks/useChatbot";

export const ChatScreen = () => {
  const { messages, sendMessage, loading } = useChatbot();

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.messages}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg, i) => (
            <ChatBubble key={i} from={msg.from as any} text={msg.text} />
          ))}

          {loading && <ActivityIndicator color="#4da2ff" style={{ margin: 15 }} />}
        </ScrollView>

        <View style={styles.inputWrapper}>
          <MessageInput onSend={sendMessage} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#0A1A2F", // 🔵 Mid-dark blue base background
  },

  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 10,
    justifyContent: "flex-end",
  },

  messages: {
    paddingVertical: 20,
    flexGrow: 1,
  },

  inputWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "rgba(255, 255, 255, 0.06)", // subtle white blur
    borderRadius: 20,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { height: 4, width: 0 },
  },
});
