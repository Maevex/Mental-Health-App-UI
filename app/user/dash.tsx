// app/user/dash.tsx
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';

export default function UserDashboard() {
  const issues = [
    'Masalah di Kampus',
    'Masalah di Rumah',
    'Masalah di Kantor',
    'Masalah dengan Teman',
    'Masalah Percintaan',
    'Masalah Keuangan',
    'Kesehatan Mental',
    'Lainnya',
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Apa yang kamu rasakan hari ini?</Text>
      <View style={styles.grid}>
        {issues.map((issue, index) => (
          <TouchableOpacity
  key={index}
  style={styles.issueButton}
  onPress={() => router.push(`/user/keluhan?kategori=${encodeURIComponent(issue)}`)}

>
  <Text style={styles.issueText}>{issue}</Text>
</TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  issueButton: {
    width: '48%',
    backgroundColor: '#E3F2FD',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  issueText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    color: '#0D47A1',
  },
});
