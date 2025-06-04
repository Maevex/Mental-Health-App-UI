import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Easing,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from '../../config/config';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';

export default function UserScreen() {
  const [user, setUser] = useState<{ nama: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Animasi
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) throw new Error('Token tidak ditemukan');

        const response = await fetch(`${BASE_URL}/myuser`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Gagal memuat data');

        setUser(data);
      } catch (error: any) {
        console.error('Fetch user error:', error.message);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message || 'Gagal memuat profil',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Animasi masuk
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

  const handleEditProfile = () => router.push('/user/edit');

  const handleLogoutConfirm = async () => {
    setModalVisible(false);
    await SecureStore.deleteItemAsync('token');
    Toast.show({
      type: 'success',
      text1: 'Berhasil logout',
      text2: 'Sampai jumpa lagi 👋',
    });
    setTimeout(() => router.replace('/login'), 1500);
  };

  const handleLogout = () => {
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!user) return null;

  return (
    <>
      <LinearGradient colors={['#89f7fe', '#66a6ff']} style={styles.gradient}>
        <View style={styles.container}>
          <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY }] }]}>
            <Text style={styles.header}>Profil Pengguna</Text>

            <Image
              source={{
                uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nama)}&background=007AFF&color=fff&size=128`,
              }}
              style={styles.avatar}
            />

            <View style={styles.info}>
              <Text style={styles.label}>Nama</Text>
              <Text style={styles.value}>{user.nama}</Text>

              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{user.email}</Text>
            </View>

            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Text style={styles.buttonText}>Edit Profil</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </LinearGradient>

      {/* Modal Konfirmasi Logout */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Konfirmasi Logout</Text>
            <Text style={styles.modalMessage}>Yakin ingin logout?</Text>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.buttonText, { color: '#007AFF' }]}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.logoutConfirmButton]}
                onPress={handleLogoutConfirm}
              >
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Toast />
    </>
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
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 20,
    color: '#333',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 20,
  },
  info: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#222',
    marginTop: 4,
  },
  editButton: {
    backgroundColor: '#4d9eff',
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },

  /* Modal styles */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 40,
    padding: 24,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 12,
    color: '#333',
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginBottom: 24,
    color: '#555',
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e0f0ff',
    marginRight: 10,
  },
  logoutConfirmButton: {
    backgroundColor: '#FF3B30',
  },
});
