import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { reloadAppAsync } from 'expo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

function ErrorFallback({ error }: { error?: Error }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
      <Text style={styles.emoji}>😵</Text>
      <Text style={styles.title}>Oops! Something went wrong</Text>
      <Text style={styles.message}>{error?.message ?? 'An unexpected error occurred'}</Text>
      <TouchableOpacity style={styles.button} onPress={() => reloadAppAsync()}>
        <Text style={styles.buttonText}>Restart App</Text>
      </TouchableOpacity>
    </View>
  );
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#FFF9FC',
  },
  emoji: { fontSize: 64, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: '700', color: '#1A0A2E', marginBottom: 10, textAlign: 'center' },
  message: { fontSize: 14, color: '#9A7FAA', textAlign: 'center', marginBottom: 32 },
  button: {
    backgroundColor: '#E91E8C',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 20,
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
