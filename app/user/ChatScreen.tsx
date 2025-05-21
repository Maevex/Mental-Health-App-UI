// app/chat/index.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from '../../config/config';
import { TouchableOpacity } from 'react-native';


type Message = {
  sender: 'user' | 'bot';
  content: string;
};

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [sesiId, setSesiId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const renderWithBold = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/); // pisah berdasarkan **bold**
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Text key={index} style={{ fontWeight: 'bold' }}>
          {part.slice(2, -2)} {/* hapus tanda ** */}
        </Text>
      );
    }
    return <Text key={index}>{part}</Text>;
  });
};

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage: Message = { sender: 'user', content: message };
    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const token = await SecureStore.getItemAsync('token');

      if (!token) {
        const errorMsg = 'Token tidak ditemukan. Silakan login kembali.';
        setMessages((prev) => [...prev, { sender: 'bot', content: errorMsg }]);
        return;
      }

      const res = await fetch(`${BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userMessage.content,
          sesi_id: sesiId,
        }),
      });

      const data = await res.json();

      const botReply = data.response || 'Terjadi kesalahan.';
      setMessages((prev) => [...prev, { sender: 'bot', content: botReply }]);
      if (data.sesi_id) setSesiId(data.sesi_id);
    } catch (err) {
      console.error('Error:', err);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', content: 'Gagal menghubungi server.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.wrapper}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Mulai mengobrol</Text>
        {messages.map((msg, index) => (
  <View
    key={index}
    style={[
      styles.messageBubble,
      msg.sender === 'user' ? styles.userBubble : styles.botBubble,
    ]}
  >
    <Text style={styles.messageText}>
      {renderWithBold(msg.content)}
    </Text>
  </View>
))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tulis pesanmu di sini..."
          multiline
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity
  onPress={handleSend}
  disabled={loading}
  style={[styles.sendButton, loading && styles.disabledButton]}
>
  <Text style={styles.sendButtonText}>
    {loading ? '...' : 'Kirim'}
  </Text>
</TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}



const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  title: {
     fontSize: 22,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 4,
    maxWidth: '80%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6E6E6',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    gap: 8,
  },
  input: {
  flex: 1,
  minHeight: 40,
  maxHeight: 100,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 20, // ubah dari 8 jadi 20
  paddingVertical: 10,
  paddingHorizontal: 16,
  textAlignVertical: 'top',
  backgroundColor: '#fff',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
  fontFamily: 'Poppins-Regular',
},

sendButton: {
  backgroundColor: '#007AFF',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 20,
},
sendButtonText: {
  color: 'white',
  fontWeight: 'bold',
  fontFamily: 'Poppins-Bold',
},
disabledButton: {
  backgroundColor: '#A0A0A0',
},


});
