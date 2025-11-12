import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ChatBubble from '../components/ChatBubble';
import MessageInput from '../components/MessageInput';
import Loader from '../components/Loader';
import { useChatbot } from '../hooks/useChatbot';

const ChatScreen = () => {
  const { messages, loading, sendMessage } = useChatbot();

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <ChatBubble message={item.text} isUser={item.sender === 'user'} />
        )}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.chatContainer}
      />
      {loading && <Loader />}
      <MessageInput onSend={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  chatContainer: { padding: 10 },
});

export default ChatScreen;
