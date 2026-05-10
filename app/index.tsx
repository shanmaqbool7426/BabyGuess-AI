import { useEffect } from 'react';
import { View } from 'react-native';
import { Redirect } from 'expo-router';
import { useApp } from '@/context/AppContext';

export default function Index() {
  const { isLoaded, hasOnboarded } = useApp();

  if (!isLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#FFF9FC' }} />;
  }

  if (!hasOnboarded) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
