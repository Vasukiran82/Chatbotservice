import React from "react";
import { SafeAreaView } from "react-native";
import { ChatScreen } from "./src/screens/ChatScreen";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ChatScreen />
    </SafeAreaView>
  );
}
