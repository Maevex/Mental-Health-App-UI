// app/user/subkategori.tsx
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';

export default function SubkategoriPage() {
  const { kategori } = useLocalSearchParams();


  const subMasalah: { [key: string]: string[] } = {
  'Masalah di Kampus': [
    'Tugas menumpuk',
    'Kesulitan memahami materi kuliah',
    'Stres menghadapi ujian',
    'Masalah dengan teman sekelas',
    'Konflik dengan dosen',
    'Kesulitan mengatur waktu',
    'Kurangnya motivasi belajar',
    'Nilai yang tidak memuaskan',
    'Terlambat masuk kuliah',
    'Ketinggalan materi',
    'Kesulitan mengakses bahan ajar',
    'Dosen tidak responsif',
    'Terlalu banyak presentasi',
    'Kurangnya dukungan dari teman',
    'Lelah mengikuti organisasi',
    'Masalah skripsi atau tugas akhir',
    'Khawatir masa depan',
    'Stres karena ekspektasi orang tua',
    'Perbedaan pendapat saat kerja kelompok',
    'Lingkungan kampus yang tidak nyaman',
  ],
  'Masalah di Rumah': [
    'Pertengkaran dengan orang tua',
    'Tanggung jawab rumah tangga yang berat',
    'Kurangnya privasi',
    'Masalah dengan saudara',
    'Lingkungan rumah tidak nyaman',
    'Tidak bisa fokus belajar di rumah',
    'Tekanan untuk membantu ekonomi keluarga',
    'Masalah komunikasi antar anggota keluarga',
    'Rasa tidak dihargai di rumah',
    'Perbedaan pandangan dengan orang tua',
    'Kondisi rumah yang sempit',
    'Kurangnya kasih sayang',
    'Kekerasan verbal di rumah',
    'Masalah tempat tinggal sementara',
    'Tidak diperbolehkan keluar rumah',
    'Kurangnya fasilitas untuk belajar',
    'Orang tua terlalu protektif',
    'Kehilangan salah satu anggota keluarga',
    'Kondisi rumah yang berantakan',
    'Tuntutan peran dewasa sejak kecil',
  ],
  'Masalah di Kantor': [
    'Deadline pekerjaan menumpuk',
    'Konflik dengan rekan kerja',
    'Tekanan dari atasan',
    'Tidak puas dengan pekerjaan',
    'Kurangnya apresiasi kerja',
    'Jam kerja yang melelahkan',
    'Tidak ada work-life balance',
    'Atasan yang otoriter',
    'Lingkungan kerja tidak mendukung',
    'Merasa tidak berkembang',
    'Pekerjaan tidak sesuai passion',
    'Tugas yang tidak jelas',
    'Karyawan toxic',
    'Gaji yang tidak sesuai',
    'Kurangnya kesempatan promosi',
    'Sistem kerja yang tidak efisien',
    'Kondisi kantor yang tidak nyaman',
    'Masalah teknologi atau alat kerja',
    'Kurangnya pelatihan atau skill support',
    'Rasa terasing karena kerja remote',
  ],
  'Masalah dengan Teman': [
    'Dikhianati teman',
    'Merasa tidak dianggap',
    'Kesulitan berkomunikasi',
    'Cemburu atau iri',
    'Terlalu bergantung pada teman',
    'Teman menjauh tanpa alasan',
    'Rasa tidak cocok dalam pertemanan',
    'Persaingan tidak sehat',
    'Salah paham berkepanjangan',
    'Sulit menemukan teman sejati',
    'Tidak dihargai pendapatnya',
    'Merasa selalu mengalah',
    'Dipaksa ikut arus',
    'Teman toxic',
    'Merasa dimanfaatkan',
    'Kurang waktu bersama',
    'Perbedaan nilai dan prinsip',
    'Teman tidak setia',
    'Perasaan diabaikan saat butuh',
    'Takut kehilangan teman baik',
  ],
  'Masalah Keuangan': [
    'Uang bulanan tidak cukup',
    'Kesulitan membayar kuliah/kos',
    'Kehilangan sumber pemasukan',
    'Tidak bisa menabung',
    'Beban hutang pribadi',
    'Pemasukan tidak tetap',
    'Harga kebutuhan pokok naik',
    'Pengeluaran tidak terkontrol',
    'Gagal mengatur anggaran',
    'Gagal dalam usaha atau bisnis',
    'Tidak punya dana darurat',
    'Tergoda belanja online',
    'Tagihan menumpuk',
    'Tidak punya asuransi',
    'Ditipu dalam transaksi',
    'Tidak bisa membantu keluarga',
    'Penghasilan lebih kecil dari pengeluaran',
    'Terpaksa meminjam uang',
    'Kehilangan pekerjaan atau side job',
    'Tergoda investasi bodong',
  ],
  'Kesehatan Mental': [
    'Depresi',
    'Kecemasan berlebih',
    'Sulit tidur (insomnia)',
    'Panik saat sendirian',
    'Overthinking berlebihan',
    'Mood swing ekstrem',
    'Sulit percaya diri',
    'Rasa tidak berguna',
    'Kesepian yang berkepanjangan',
    'Merasa selalu gagal',
    'Kecanduan gadget atau media sosial',
    'Gangguan makan',
    'Terlalu perfeksionis',
    'Trauma masa lalu',
    'Fobia sosial',
    'Sulit fokus dalam aktivitas',
    'Emosi tidak stabil',
    'Rasa ingin menyakiti diri sendiri',
    'Tidak punya tujuan hidup',
    'Selalu merasa cemas terhadap masa depan',
  ],
};

  const originalList = subMasalah[kategori as string] || [];
  const list = originalList.sort(() => Math.random() - 0.5).slice(0, 5);

  return (
    <LinearGradient colors={['#E3F2FD', '#FFFFFF']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{kategori}</Text>
        <View style={styles.list}>
          {list.map((item, index) => (
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: index * 100, type: 'timing', duration: 400 }}
              key={index}
            >
              <Pressable
                style={({ pressed }) => [
                  styles.issueButton,
                  pressed && styles.pressed,
                ]}
                onPress={() =>
                  router.push({
                    pathname: '/user/keluhan',
                    params: { kategori, sub_kategori: item },
                  })
                }
              >
                <Text style={styles.issueText}>{item}</Text>
              </Pressable>
            </MotiView>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 28,
    color: '#0D47A1',
  },
  list: {
    gap: 16,
  },
  issueButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  issueText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#1565C0',
    textAlign: 'center',
  },
});