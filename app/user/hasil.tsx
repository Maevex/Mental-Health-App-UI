// app/user/hasil.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';


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
  const { kategori, keluhan, kesimpulan, saran, rekomendasi, konsultan } = useLocalSearchParams();

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Hasil Analisis Keluhan</Text>
      <Text style={styles.label}>Kategori: <Text style={styles.value}>{kategori}</Text></Text>
      <Text style={styles.label}>Keluhan: <Text style={styles.value}>"{keluhan}"</Text></Text>

      <Text style={styles.sectionTitle}>Kesimpulan Chatbot</Text>
      <Text style={styles.value}>{renderWithBold(kesimpulan as string)}</Text>
      <Text style={styles.value}><Text style={{ fontWeight: 'bold' }}>{saran}</Text></Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push({ pathname: '/user/ChatScreen' }as any)}> 
  <Text style={styles.buttonText}>Mulai Chat</Text>
</TouchableOpacity>

      {parsedKonsultan.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>{rekomendasi}</Text>
          {parsedKonsultan.map((k: any, i: number) => (
            <View key={i} style={styles.card}>
              <Text style={styles.konsultanName}>{k.nama}</Text>
              <Text>{k.spesialisasi} ({k.pengalaman})</Text>
              <Text>Telp: {k.no_telepon}</Text>
              <Text>Email: {k.email}</Text>
              
            </View>
          ))}
        </>
      )}
    </ScrollView>
    
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontFamily: 'Poppins-Bold', marginBottom: 15 },
  label: { fontSize: 16, fontFamily: 'Poppins-SemiBold' },
  value: { fontFamily: 'Poppins-Regular', marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontFamily: 'Poppins-Bold', marginVertical: 15 },
  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    marginBottom: 10,
  },
  konsultanName: { fontSize: 16, fontFamily: 'Poppins-Bold' },
  button: {
  backgroundColor: '#007AFF',
  paddingVertical: 12,
  borderRadius: 25,
  alignItems: 'center',
  marginTop: 20,
},
buttonText: {
  color: '#fff',
  fontFamily: 'Poppins-Bold',
  fontSize: 16,
},

});
