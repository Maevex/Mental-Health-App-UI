import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

const renderWithBold = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Text key={index} style={{ fontWeight: 'bold' }}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    return <Text key={index}>{part}</Text>;
  });
};

export default function HasilScreen() {
  const { kategori, keluhan, kesimpulan, saran, rekomendasi } = useLocalSearchParams();
  const [parsedKonsultan, setParsedKonsultan] = useState([]);

  useEffect(() => {
    (async () => {
      const stored = await SecureStore.getItemAsync('konsultanData');
      if (stored) {
        try {
          setParsedKonsultan(JSON.parse(stored));
        } catch (e) {
          console.error('Gagal parsing dari SecureStore', e);
        }
      }
    })();
  }, []);

  return (
    <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInUp.duration(600)}>
          <Text style={styles.title}>📝 Hasil Analisis Keluhan</Text>

          <Text style={styles.label}>
            Kategori: <Text style={styles.value}>{kategori}</Text>
          </Text>
          <Text style={styles.label}>
            Keluhan: <Text style={styles.value}>"{keluhan}"</Text>
          </Text>

          <Text style={styles.sectionTitle}>🧠 Kesimpulan Chatbot</Text>
          <Text style={styles.value}>{renderWithBold(kesimpulan as string)}</Text>
          <Text style={[styles.value, { fontWeight: 'bold' }]}>{saran}</Text>

          <TouchableOpacity style={styles.button} onPress={() => router.push({ pathname: '/user/ChatScreen' } as any)}>
            <Text style={styles.buttonText}>💬 Mulai Chat</Text>
          </TouchableOpacity>
        </Animated.View>

        {parsedKonsultan.length > 0 && (
          <Animated.View entering={FadeInUp.delay(300).duration(600)}>
            <Text style={styles.sectionTitle}>📌 {rekomendasi}</Text>
            {parsedKonsultan.map((k: any, i: number) => (
              <View key={i} style={styles.card}>
                <Text style={styles.konsultanName}>
                  <Ionicons name="person-circle" size={20} color="#007AFF" /> {k.nama}
                </Text>
                <Text style={styles.cardText}>{k.spesialisasi} ({k.pengalaman})</Text>
                <Text style={styles.cardText}>📞 {k.no_telepon}</Text>
                <Text style={styles.cardText}>✉️ {k.email}</Text>
              </View>
            ))}
          </Animated.View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontFamily: 'Poppins-Bold', marginBottom: 20, color: '#333' },
  label: { fontSize: 16, fontFamily: 'Poppins-SemiBold', marginBottom: 4, color: '#444' },
  value: { fontFamily: 'Poppins-Regular', color: '#333', marginBottom: 10 },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#007AFF',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 25,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  konsultanName: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
    color: '#222',
  },
  cardText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#555',
  },
});
