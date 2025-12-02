// app/index.tsx
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import ChatScreen from "../src/screens/ChatScreen";           // ← Correct
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useChatStore } from "../src/store/useChatStore";         // ← Correct

export default function App() {
  const { loadHistory } = useChatStore();

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <ChatScreen />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});