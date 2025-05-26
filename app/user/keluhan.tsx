import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from '../../config/config';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';

export default function KeluhanScreen() {
  const { kategori, sub_kategori } = useLocalSearchParams();
  const [keluhan, setKeluhan] = useState('');

  const handleSubmit = async () => {
    const token = await SecureStore.getItemAsync('token');
    try {
      const response = await fetch(`${BASE_URL}/analisa-keluhan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ keluhan, kategori, sub_kategori }),
      });
      const data = await response.json();
      await SecureStore.setItemAsync('konsultanData', JSON.stringify(data.konsultan || []));

      if (response.ok) {
        router.push({
          pathname: '/user/hasil',
          params: {
            keluhan,
            kategori,
            kesimpulan: data.kesimpulan,
            saran: data.saran,
            rekomendasi: data.rekomendasi || '',
          },
        });
      } else {
        alert(data.message || 'Gagal mengirim keluhan');
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat mengirim keluhan');
    }
  };

  return (
    <LinearGradient colors={['#E3F2FD', '#FFFFFF']} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <MotiView from={{ opacity: 0, translateY: 30 }} animate={{ opacity: 1, translateY: 0 }} transition={{ duration: 600 }}>
            <Text style={styles.title}>Keluhanmu tentang:</Text>
            <Text style={styles.subtitle}>{sub_kategori}</Text>

            <TextInput
              placeholder="Tulis keluhanmu di sini..."
              multiline
              style={styles.input}
              value={keluhan}
              onChangeText={setKeluhan}
            />

            <TouchableOpacity onPress={handleSubmit} style={styles.buttonWrapper}>
              <LinearGradient colors={['#1565C0', '#42A5F5']} style={styles.button}>
                <Text style={styles.buttonText}>Kirim</Text>
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

import { ScrollView } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    color: '#0D47A1',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    textAlignVertical: 'top',
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    borderColor: '#BBDEFB',
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    marginBottom: 24,
  },
  buttonWrapper: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
});
