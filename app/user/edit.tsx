import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';
import { BASE_URL } from '../../config/config';
import { LinearGradient } from 'expo-linear-gradient';

export default function EditProfileScreen() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        Toast.show({ type: 'error', text1: 'Token tidak ditemukan' });
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/myuser`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setNama(data.nama);
          setEmail(data.email);
        } else {
          Toast.show({ type: 'error', text1: 'Gagal mengambil data user' });
        }
      } catch (error) {
        Toast.show({ type: 'error', text1: 'Terjadi kesalahan saat fetch user' });
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Handle update user submit
  const handleUpdate = async () => {
    setLoading(true);
    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      Toast.show({ type: 'error', text1: 'Token tidak ditemukan' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/userupdate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nama, email, password }),
      });

      if (response.ok) {
        Toast.show({ type: 'success', text1: 'Profil berhasil diperbarui' });
        setPassword(''); // clear password after update
      } else {
        const data = await response.json();
        Toast.show({ type: 'error', text1: 'Gagal update profil', text2: data.message || '' });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Terjadi kesalahan saat update' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5E9CFF" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#89f7fe', '#66a6ff']} style={styles.gradient}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Edit Profil</Text>

          <TextInput
            placeholder="Nama"
            value={nama}
            onChangeText={setNama}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            placeholderTextColor="#999"
          />

          <TextInput
            placeholder="Password (kosongkan jika tidak ingin ganti)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#999"
          />

          <TouchableOpacity onPress={handleUpdate} style={styles.button}>
            <Text style={styles.buttonText}>Simpan Perubahan</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
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
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  input: {
    height: 50,
    backgroundColor: '#f0f4f8',
    borderRadius: 15,
    paddingHorizontal: 15,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    marginBottom: 14,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
