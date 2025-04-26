import { useFonts } from "expo-font";
import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null; // bisa kamu ganti dengan SplashScreen juga
  }

  return (
    <>
      <Stack />
      <Toast /> {/* ini penting, biar toast-nya bisa muncul */}
    </>
  );
}
