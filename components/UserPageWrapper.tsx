import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function UserPageWrapper({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 24,
        paddingBottom: 120 + insets.bottom, // supaya konten gak ketiban navbar
        flexGrow: 1,
      }}
    >
      {children}
    </ScrollView>
  );
}
