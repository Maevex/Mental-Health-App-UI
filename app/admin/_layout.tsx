import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Link, Slot, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert('Logout', 'Yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await SecureStore.deleteItemAsync('token');
          router.replace('/');
        },
      },
    ]);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Hamburger button */}
      <TouchableOpacity
        onPress={toggleSidebar}
        style={styles.hamburgerBtn}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="menu-outline" size={30} color="#1e40af" />
      </TouchableOpacity>

      {/* Sidebar & overlay */}
      {sidebarOpen && (
        <View style={styles.sidebarOverlay}>
          <View style={styles.sidebar}>
            <Text style={styles.logo}>Admin Panel</Text>

            <Link href="/admin/dash" asChild>
              <TouchableOpacity style={styles.navItem} onPress={toggleSidebar}>
                <Ionicons name="speedometer-outline" size={20} color="#333" />
                <Text style={styles.navText}>Dashboard</Text>
              </TouchableOpacity>
            </Link>

            <Link href="/admin/consultant" asChild>
              <TouchableOpacity style={styles.navItem} onPress={toggleSidebar}>
                <Ionicons name="people-outline" size={20} color="#333" />
                <Text style={styles.navText}>Consultant</Text>
              </TouchableOpacity>
            </Link>

            <View style={styles.spacer} />

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#e11d48" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          {/* Overlay */}
          <TouchableOpacity
            style={styles.overlayBackground}
            onPress={toggleSidebar}
          />
        </View>
      )}

      {/* Main Content */}
      <View style={[styles.content, sidebarOpen && styles.contentBlurred]}>
        <Slot />
      </View>
    </SafeAreaView>
  );
}

const SIDEBAR_WIDTH = 240;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
  },
  hamburgerBtn: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 20,
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  sidebarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    zIndex: 15,
    flexDirection: 'row',
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: '#f0f4f8',
    padding: 20,
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    zIndex: 20,
     paddingTop: 70, 
  },
  logo: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 30,
    color: '#1e40af',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  navText: {
    marginLeft: 10,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  spacer: {
    flex: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    marginLeft: 10,
    color: '#e11d48',
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
  },
  content: {
    flex: 1,
    padding: 20,
    zIndex: 1,
  },
  contentBlurred: {
    opacity: 0.4, // kamu bisa ganti ini dengan efek blur juga kalau pakai expo-blur
  },
});
