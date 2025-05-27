import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from '../../config/config'; // pastikan path benar

export default function UserScreen() {
  const [user, setUser] = useState<{ nama: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) throw new Error('Token tidak ditemukan');

        const response = await fetch(`${BASE_URL}/myuser`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Gagal memuat data');

        setUser(data);
      } catch (error: any) {
        console.error('Fetch user error:', error.message);
        Alert.alert('Error', error.message || 'Gagal memuat profil');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleEditProfile = () => {
    router.push('/user/edit');
  };

  const handleLogout = () => {
    Alert.alert('Konfirmasi', 'Yakin ingin logout?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await SecureStore.deleteItemAsync('token');
          router.replace('/login');
        },
      },
    ]);
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
    <View style={styles.container}>
      <Text style={styles.header}>Profil Pengguna</Text>

      <View style={styles.profileCard}>
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

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.buttonText}>Edit Profil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
   buttonContainer: {
    marginTop: 30,
    width: '100%',
  },
  header: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 20,
  },
  info: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    marginTop: 16,
     fontFamily: 'Poppins-Regular',
  },
  value: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
    marginTop: 4,
     fontFamily: 'Poppins-Regular',
   
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
});
