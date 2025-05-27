// app/admin/konsultan.tsx
import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from '../../config/config';
import { router } from 'expo-router';

interface Konsultan {
  id: number;
  nama: string;
  spesialisasi: string;
  pengalaman: string;
  no_telepon: string;
  email: string;
}

export default function KonsultanList() {
  const [data, setData] = useState<Konsultan[]>([]);

  const fetchKonsultan = async () => {
    const token = await SecureStore.getItemAsync('token');
    const res = await fetch(`${BASE_URL}/consultants`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    setData(json);

    console.log('Data konsultan:', json);
    
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      'Hapus Konsultan',
      'Apakah kamu yakin ingin menghapus konsultan ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            const token = await SecureStore.getItemAsync('token');
            const res = await fetch(`${BASE_URL}/consultantDel/${id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
              fetchKonsultan();
            } else {
              alert('Gagal menghapus konsultan');
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchKonsultan();
  }, []);

  const renderItem = ({ item }: { item: Konsultan }) => (
    <View style={styles.card}>
      <Text style={styles.nama}>{item.nama}</Text>
      <Text>{item.spesialisasi}</Text>
      <Text>{item.pengalaman}</Text>
      <Text>{item.email}</Text>
      <Text>{item.no_telepon}</Text>
      <View style={styles.row}>
        <TouchableOpacity 
        onPress={() => 
            router.push({
            pathname: '/admin/editConsultant/[id]',
            params: { id: item.id.toString() },
            } as any)
            
        }>
          <Text style={styles.edit}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Text style={styles.delete}>Hapus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Daftar Konsultan</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity
        onPress={() => router.push('/admin/addConsultant')}
        style={styles.tambahButton}
      >
        <Text style={styles.tambahText}>+ Tambah Konsultan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  card: {
    backgroundColor: '#f0f4f8',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  nama: { fontSize: 16, fontWeight: 'bold' },
  row: { flexDirection: 'row', marginTop: 8, gap: 12 },
  edit: { color: '#3b82f6' },
  delete: { color: '#ef4444' },
  tambahButton: {
    backgroundColor: '#4ade80',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  tambahText: { color: 'white', fontWeight: 'bold' },
});
