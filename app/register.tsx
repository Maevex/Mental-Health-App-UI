import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { router } from 'expo-router';
import { BASE_URL } from '../config/config';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';

export default function RegisterScreen() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRegister = async () => {
    if (!nama || !email || !password) {
      Toast.show({
        type: 'error',
        text1: 'mohon isi semua field',
        position: 'bottom',
        bottomOffset: 60,
      });
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nama, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Registrasi berhasil!',
          position: 'bottom',
          bottomOffset: 60,
        });

        setTimeout(() => {
          router.replace('/login');
        }, 1000);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Registrasi gagal',
          text2: data.message || 'Coba periksa input kamu lagi',
          position: 'bottom',
          bottomOffset: 60,
        });
      }
    } catch (error) {
      console.error('Register error:', error);
      Toast.show({
        type: 'error',
        text1: 'Terjadi kesalahan saat register',
        position: 'bottom',
        bottomOffset: 60,
      });
    }
  };

  return (
    <LinearGradient colors={['#89f7fe', '#66a6ff']} style={styles.gradient}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY }] }]}>
          <Text style={styles.title}>Start Your Journey with Serenity</Text>

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
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#999"
          />

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={handleRegister}
              style={styles.button}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Daftar</Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity onPress={() => router.push('/login')} style={styles.link}>
            <Text style={styles.linkText}>Sudah punya akun? Login</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
  link: {
    marginTop: 18,
  },
  linkText: {
    color: '#3b82f6',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});
