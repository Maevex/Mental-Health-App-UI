// app/user/dash.tsx
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';

export default function UserDashboard() {
  const issues = [
    'Masalah di Kampus',
    'Masalah di Rumah',
    'Masalah di Kantor',
    'Masalah dengan Teman',
    'Masalah Keuangan',
    'Kesehatan Mental',
  ];

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

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

  return (
    <LinearGradient colors={['#A1C4FD', '#C2E9FB']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY }] }]}>
          <Text style={styles.title}>Apa yang kamu rasakan hari ini?</Text>
          <View style={styles.grid}>
            {issues.map((issue, index) => (
              <Pressable
                key={index}
                onPress={() =>
                  router.push(`/user/subkategori?kategori=${encodeURIComponent(issue)}`)
                }
                style={({ pressed }) => [
                  styles.issueButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.issueText}>{issue}</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffffdd',
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 28,
    color: '#0D47A1',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  issueButton: {
    width: '48%',
    backgroundColor: '#ffffff',
    paddingVertical: 22,
    paddingHorizontal: 16,
    borderRadius: 18,
    marginBottom: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  issueText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#1565C0',
    textAlign: 'center',
  },
});
