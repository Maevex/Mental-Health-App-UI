import { useFonts } from "expo-font";
import { Stack } from 'expo-router';

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
      'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
      'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    });
  
    if (!fontsLoaded) {
      return null; // atau splash screen
    }
  
    return <Stack />;
  }