import { useEffect } from 'react';
import { router, useRootNavigationState } from 'expo-router';

export default function Index() {
  const rootNavigation = useRootNavigationState();

  useEffect(() => {
    if (!rootNavigation?.key) return; 
    router.replace('/login'); 
  }, [rootNavigation]);

  return null;
}
