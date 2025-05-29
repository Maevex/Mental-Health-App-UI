import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from '../../config/config';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function AddConsultant() {
  const [nama, setNama] = useState('');
  const [spesialisasi, setSpesialisasi] = useState('');
  const [pengalaman, setPengalaman] = useState('');
  const [noTelepon, setNoTelepon] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async () => {
    if (!nama || !spesialisasi || !pengalaman || !noTelepon || !email) {
      Alert.alert('Semua field harus diisi');
      return;
    }

    const token = await SecureStore.getItemAsync('token');
    const body = {
      nama,
      spesialisasi,
      pengalaman,
      no_telepon: noTelepon,
      email,
    };

    try {
      const res = await fetch(`${BASE_URL}/consultantIns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        Alert.alert('Sukses', 'Konsultan berhasil ditambahkan');
        router.replace('/admin/consultant');
      } else {
        const err = await res.text();
        Alert.alert('Gagal menambahkan', err);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Terjadi kesalahan saat menambahkan konsultan');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Tambah Konsultan</Text>

      <TextInput style={styles.input} placeholder="Nama" value={nama} onChangeText={setNama} />
      <TextInput style={styles.input} placeholder="Spesialisasi" value={spesialisasi} onChangeText={setSpesialisasi} />
      <TextInput style={styles.input} placeholder="Pengalaman" value={pengalaman} onChangeText={setPengalaman} />
      <TextInput style={styles.input} placeholder="No. Telepon" value={noTelepon} onChangeText={setNoTelepon} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />

      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitText}>Simpan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#4ade80',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
