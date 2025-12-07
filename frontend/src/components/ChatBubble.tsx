import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  from: "user" | "bot";
  text: string;
}

export const ChatBubble: React.FC<Props> = ({ from, text }) => (
  <View
    style={[
      styles.bubble,
      from === "user" ? styles.userBubble : styles.botBubble,
    ]}
  >
    <Text
      style={[
        styles.text,
        from === "user" ? styles.userText : styles.botText,
      ]}
    >
      {text}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  bubble: {
    maxWidth: "78%",
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 4,
  },

  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 4,
    borderWidth: 0.5,
    borderColor: "#ddd",
  },

  userText: { color: "#080000ff", fontSize: 16 },
  botText: { color: "#080000ff", fontSize: 16 },

  text: { fontSize: 16 },
});
