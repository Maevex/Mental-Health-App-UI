// app/chat/index.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from '../../config/config';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated, Easing } from 'react-native';
import { useRef } from 'react';

type Message = {
  sender: 'user' | 'bot';
  content: string;
};

type Sesi = {
  sesi_id: number;
  waktu_mulai: string;
};

export default function ChatScreen() {
  const [sesiList, setSesiList] = useState<Sesi[]>([]);
  const [sesiId, setSesiId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarAnim = useRef(new Animated.Value(-200)).current; // mulai dari kiri luar layar

  

  const fetchSesi = async () => {
    const token = await SecureStore.getItemAsync('token');
    const res = await fetch(`${BASE_URL}/sesi`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setSesiList(data);
  };

  const fetchDetailSesi = async (id: number) => {
  const token = await SecureStore.getItemAsync('token');
  const res = await fetch(`${BASE_URL}/sesi/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  console.log(data);
  
  // Asumsinya 1 objek = 1 pasang: user message dan bot response
  const mappedMessages: Message[] = [];
  data.forEach((item: any) => {
    if (item.message) {
      mappedMessages.push({ sender: 'user', content: item.message });
    }
    if (item.chatbot_response) {
      mappedMessages.push({ sender: 'bot', content: item.chatbot_response });
    }
  });

  setMessages(mappedMessages);
};

const getPreviewText = (id: number) => {
  const sesiMessages = messages.filter((msg, index) => {
    return sesiId === id && msg.sender === 'user';
  });
  return sesiMessages[0]?.content.slice(0, 20) + '...';
};



  const handleNewChat = async () => {
    setMessages([]);
    setSesiId(null); // biar backend buat sesi baru saat kirim pertama
  };

  const handleSelectSesi = async (id: number) => {
    setSesiId(id);
    await fetchDetailSesi(id);
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    const userMessage: Message = { sender: 'user', content: message };
    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const token = await SecureStore.getItemAsync('token');
      const res = await fetch(`${BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage.content, sesi_id: sesiId }),
      });
      const data = await res.json();
      const botReply = data.response || 'Terjadi kesalahan.';
      setMessages((prev) => [...prev, { sender: 'bot', content: botReply }]);
      if (data.sesi_id) {
        setSesiId(data.sesi_id);
        fetchSesi(); // update daftar sesi
      }
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', content: 'Gagal kirim pesan.' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSesi();
  }, []);

  useEffect(() => {
  Animated.timing(sidebarAnim, {
    toValue: sidebarVisible ? 0 : -200, // geser masuk ke 0 atau keluar ke -200
    duration: 300,
    easing: Easing.out(Easing.ease),
    useNativeDriver: false,
  }).start();
}, [sidebarVisible]);


    return (
    <View style={styles.wrapper}>
      {/* Sidebar */}
      {sidebarVisible && (
        <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarAnim }] }]}>

          <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
            <Text style={styles.newChatText}>+ New Chat</Text>
          </TouchableOpacity>
          <ScrollView>
            {sesiList.map((sesi) => (
              <TouchableOpacity
                key={sesi.sesi_id}
                style={[
                  styles.sesiButton,
                  sesiId === sesi.sesi_id && styles.activeSesiButton,
                ]}
                onPress={() => {
                  handleSelectSesi(sesi.sesi_id);
                  setSidebarVisible(false); // auto-tutup habis pilih
                }}
              >
               <Text style={styles.sesiText}>Sesi {sesi.sesi_id}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      )}

      {/* Chat Area */}
      <View style={styles.chatArea}>
        {/* Header with hamburger icon */}
        <LinearGradient
  colors={['#007AFF', '#00C6FF']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
  style={styles.header}
>
  <TouchableOpacity onPress={() => setSidebarVisible(!sidebarVisible)}>
    <Text style={styles.hamburger}>☰</Text>
  </TouchableOpacity>
  
  {sesiId && (
    <Text style={styles.sesiInfo}>Sesi {sesiId}</Text>
  )}
</LinearGradient>

        <ScrollView contentContainerStyle={styles.chatContainer}>
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                msg.sender === 'user' ? styles.userBubble : styles.botBubble,
              ]}
            >
              <Text style={{ color: msg.sender === 'user' ? '#fff' : '#000', fontFamily: 'Poppins-Regular' }}>
  {msg.content}
</Text>

            </View>
          ))}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Tulis pesan..."
            multiline
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendText}>Kirim</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  wrapper: {
  flex: 1,
  flexDirection: 'row', // tambahkan ini agar sidebar dan chatArea berdampingan
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
  borderRadius: 20,
  marginVertical: 6,
  maxWidth: '80%',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 3,
  elevation: 1,
},
userBubble: {
  alignSelf: 'flex-end',
  backgroundColor: '#007AFF',
  borderTopRightRadius: 0,
},
botBubble: {
  alignSelf: 'flex-start',
  backgroundColor: '#eaeaea',
  borderTopLeftRadius: 0,
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
  borderRadius: 25,
  paddingVertical: 10,
  paddingHorizontal: 16,
  backgroundColor: '#f9f9f9',
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
sidebar: {
  width: 160,
  padding: 10,
  borderRightWidth: 1,
  borderColor: '#ccc',
  height: '100%',
  backgroundColor: '#f0f4ff',
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  shadowColor: '#000',
  shadowOffset: { width: 2, height: 0 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 5,
  zIndex: 999,
},




newChatButton: {
  backgroundColor: '#007AFF',
  padding: 10,
  borderRadius: 8,
  marginBottom: 10,
},

newChatText: {
  color: '#fff',
  textAlign: 'center',
  fontWeight: 'bold',
},

sesiButton: {
  padding: 8,
  marginVertical: 4,
  borderRadius: 6,
  backgroundColor: '#eee',
},

activeSesiButton: {
  backgroundColor: '#cce5ff',
},

sesiText: {
  fontSize: 14,
  textAlign: 'center',
},

chatArea: {
  flex: 1,
  backgroundColor: '#fff',
},

chatContainer: {
  paddingHorizontal: 10, // hanya horizontal
  paddingBottom: 100,
},



sendText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
},
header: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderBottomWidth: 1,
  borderBottomColor: '#ccc',
  backgroundColor: '#fff', // biar warnanya seragam
},


hamburger: {
  fontSize: 24,
  fontWeight: 'bold',
},

sesiInfo: {
  marginLeft: 16,
  color: '#fff',
  fontSize: 16,
  fontFamily: 'Poppins-Regular',
},

});
