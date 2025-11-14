import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

export const MessageInput = ({ onSend }: { onSend: (text: string) => void }) => {
  const [text, setText] = useState("");
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type your message..."
        value={text}
        onChangeText={setText}
      />
      <Button
        title="Send"
        onPress={() => {
          onSend(text);
          setText("");
        }}
      />
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
  },
});
