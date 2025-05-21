// app/user/keluhan.tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from '../../config/config';


export default function KeluhanScreen() {
    
  const { kategori } = useLocalSearchParams();
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
        body: JSON.stringify({ keluhan, kategori }),
      });
      const data = await response.json();
      await SecureStore.setItemAsync('konsultanData', JSON.stringify(data.konsultan || []));
        console.log('data.konsultan before stringify:', data.konsultan);

      if (response.ok) {
        router.push({
          pathname: '/user/hasil',
          params: {
          keluhan,
          kategori,
          kesimpulan: data.kesimpulan,
          saran: data.saran,
          rekomendasi: data.rekomendasi || ''
  }
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
    <View style={styles.container}>
      <Text style={styles.title}>Keluhanmu tentang {kategori}</Text>
      <TextInput
        placeholder="Tulis keluhanmu di sini..."
        multiline
        style={styles.input}
        value={keluhan}
        onChangeText={setKeluhan}
      />
      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Kirim</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 20, fontFamily: 'Poppins-Bold', marginBottom: 20 },
  input: {
    height: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 15,
    textAlignVertical: 'top',
    fontFamily: 'Poppins-Regular',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
});
