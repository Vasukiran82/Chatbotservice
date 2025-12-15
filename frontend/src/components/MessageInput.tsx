// src/components/MessageInput.tsx
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from "react-native";

export const MessageInput = ({ onSend }: { onSend: (text: string) => Promise<any> | void }) => {
  const [text, setText] = useState("");

  const submit = async () => {
    const t = (text || "").trim();
    if (!t) return;
    setText("");
    try {
      await onSend(t);
    } catch (err) {
      console.warn("onSend error", err);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type your message..."
        value={text}
        onChangeText={setText}
        multiline
      />
      <TouchableOpacity
        onPress={submit}
        style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
        disabled={!text.trim()}
      >
        <Text style={styles.sendText}>{text.trim() ? "Send" : "..."}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", padding: 10, alignItems: "center" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 8,
    marginRight: 8,
    maxHeight: 120,
    backgroundColor: "#fff",
  },
  sendBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  sendBtnDisabled: {
    backgroundColor: "#9fc8ff",
  },
  sendText: { color: "#fff", fontWeight: "600" },
});
