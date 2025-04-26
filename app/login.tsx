import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from '../config/config';
import { jwtDecode } from 'jwt-decode';
import Toast from 'react-native-toast-message';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  interface MyJwtPayload {
    role: string;
    // bisa tambahin properti lain juga kalau ada, misalnya:
    // email: string;
    // userId: number;
  }
  

  const handleLogin = async () => {
    console.log(BASE_URL);
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      console.log('Response JSON:', data); 
  
      if (response.ok) {
        const token = data.token;
        console.log('Token:', token); 
        await SecureStore.setItemAsync('token', token);
  
        const decoded = jwtDecode<MyJwtPayload>(token);
        console.log('Decoded Token:', decoded); 
        
        const role = decoded.role;
        Toast.show({
          type: 'success',
          text1: 'Login berhasil',
          text2: `Sebagai ${role}`,
          position: 'bottom',
          visibilityTime: 2000,
          bottomOffset: 60,
        });
      
        setTimeout(() => {
        if (role === 'admin') {
          router.replace('/admin/dash');
        } else {
          router.replace('/user/dash');
        }
      }, 800);}
       else {
        Toast.show({
          type: 'error',
          text1: 'Login gagal',
          text2: data.message || 'Periksa kembali email/password',
          position: 'bottom',
          bottomOffset: 60,
        });
      }
    } catch (error: any) {
      alert('Terjadi kesalahan saat login');
      console.error('Login error:', error.message || error);
    }
  };
  
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/register')} style={styles.link}>
        <Text style={styles.linkText}>Belum punya akun? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 15,
    marginBottom: 12,
    borderRadius: 25,
    fontSize: 16,
    fontFamily: 'Poppins-Regular', // <- penting ini!
  },

  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25, // Membuat tombol lebih bulat
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
  
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  link: {
    marginTop: 20,
  },
  linkText: {
    color: 'blue',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});
