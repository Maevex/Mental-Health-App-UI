// app/chat/index.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from '../../config/config';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [sesiId, setSesiId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
  if (!message.trim()) return;

  setLoading(true);
  try {
    const token = await SecureStore.getItemAsync('token'); // GANTI INI DARI AsyncStorage ke SecureStore

    if (!token) {
      setResponse('Token tidak ditemukan. Silakan login kembali.');
      return;
    }

    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: message,
        sesi_id: sesiId,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setResponse(data.response);
      if (data.sesi_id) setSesiId(data.sesi_id);
    } else {
      setResponse(data.response || 'Terjadi kesalahan.');
    }
  } catch (err) {
    console.error('Error:', err);
    setResponse('Gagal menghubungi server.');
  } finally {
    setLoading(false);
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Curhatin Keluhanmu</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Apa yang kamu rasakan?"
        value={message}
        onChangeText={setMessage}
      />
      <Button title={loading ? 'Mengirim...' : 'Kirim'} onPress={handleSend} disabled={loading} />
      {response !== '' && (
        <View style={styles.responseBox}>
          <Text style={styles.responseText}>{response}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  input: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    textAlignVertical: 'top',
  },
  responseBox: {
    marginTop: 20,
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
  },
  responseText: {
    fontSize: 16,
  },
});
