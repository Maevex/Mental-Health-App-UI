import { useEffect } from 'react';
import { router, useRootNavigationState } from 'expo-router';

export default function Index() {
  const rootNavigation = useRootNavigationState();

  useEffect(() => {
    if (!rootNavigation?.key) return; // tunggu sampai layout siap
    router.replace('/login'); // baru pindah halaman
  }, [rootNavigation]);

  return null;
}
