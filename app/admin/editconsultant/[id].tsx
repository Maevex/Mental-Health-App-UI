// app/admin/editConsultant/[id].tsx
import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from '../../../config/config';

export default function EditConsultant() {
  const { id } = useLocalSearchParams();
  const [form, setForm] = useState({
    nama: '',
    spesialisasi: '',
    pengalaman: '',
    no_telepon: '',
    email: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = await SecureStore.getItemAsync('token');
    const res = await fetch(`${BASE_URL}/consultant/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    setForm(json);
  };

  const handleUpdate = async () => {
    const token = await SecureStore.getItemAsync('token');
    const res = await fetch(`${BASE_URL}/consultantUpdate/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      Alert.alert('Berhasil', 'Data konsultan berhasil diperbarui');
      router.replace('/admin/consultant');
    } else {
      Alert.alert('Gagal', 'Terjadi kesalahan saat memperbarui data');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Edit Konsultan</Text>
      {['nama', 'spesialisasi', 'pengalaman', 'no_telepon', 'email'].map((key) => (
        <TextInput
          key={key}
          style={styles.input}
          placeholder={key.replace('_', ' ')}
          value={form[key as keyof typeof form]}
          onChangeText={(text) => setForm({ ...form, [key]: text })}
        />
      ))}
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Simpan Perubahan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  input: {
    backgroundColor: '#f0f4f8',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
