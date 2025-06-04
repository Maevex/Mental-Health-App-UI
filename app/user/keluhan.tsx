import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
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
    <LinearGradient colors={['#89f7fe', '#66a6ff']} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <MotiView
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 600 }}
            style={styles.card}
          >
            <Text style={styles.title}>Keluhanmu tentang:</Text>
            <Text style={styles.subtitle}>{sub_kategori}</Text>

            <TextInput
              placeholder="Tulis keluhanmu di sini..."
              multiline
              style={styles.input}
              value={keluhan}
              onChangeText={setKeluhan}
              placeholderTextColor="#999"
            />

            <TouchableOpacity onPress={handleSubmit} activeOpacity={0.8} style={styles.button}>
              <Text style={styles.buttonText}>Kirim</Text>
            </TouchableOpacity>
          </MotiView>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    color: '#444',
    marginBottom: 18,
  },
  input: {
    height: 150,
    backgroundColor: '#f0f4f8',
    borderRadius: 16,
    padding: 16,
    textAlignVertical: 'top',
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    borderColor: '#d1e3ff',
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#4d9eff',
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
});
