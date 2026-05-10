import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Prediction {
  id: string;
  date: string;
  result: 'girl' | 'boy';
  confidence: number;
  girlScore: number;
  boyScore: number;
  factors: string[];
}

interface AppContextType {
  language: 'en' | 'ur';
  setLanguage: (lang: 'en' | 'ur') => void;
  hasOnboarded: boolean;
  completeOnboarding: () => void;
  predictions: Prediction[];
  addPrediction: (p: Omit<Prediction, 'id' | 'date'>) => void;
  clearHistory: () => void;
  isLoaded: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  LANGUAGE: 'babyguess_language',
  ONBOARDED: 'babyguess_onboarded',
  PREDICTIONS: 'babyguess_predictions',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<'en' | 'ur'>('en');
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [lang, onboarded, preds] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
          AsyncStorage.getItem(STORAGE_KEYS.ONBOARDED),
          AsyncStorage.getItem(STORAGE_KEYS.PREDICTIONS),
        ]);
        if (lang === 'en' || lang === 'ur') setLanguageState(lang);
        if (onboarded === 'true') setHasOnboarded(true);
        if (preds) setPredictions(JSON.parse(preds));
      } catch {}
      setIsLoaded(true);
    };
    load();
  }, []);

  const setLanguage = async (lang: 'en' | 'ur') => {
    setLanguageState(lang);
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  };

  const completeOnboarding = async () => {
    setHasOnboarded(true);
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDED, 'true');
  };

  const addPrediction = async (p: Omit<Prediction, 'id' | 'date'>) => {
    const newPred: Prediction = {
      ...p,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      date: new Date().toISOString(),
    };
    const updated = [newPred, ...predictions].slice(0, 50);
    setPredictions(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.PREDICTIONS, JSON.stringify(updated));
  };

  const clearHistory = async () => {
    setPredictions([]);
    await AsyncStorage.removeItem(STORAGE_KEYS.PREDICTIONS);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        hasOnboarded,
        completeOnboarding,
        predictions,
        addPrediction,
        clearHistory,
        isLoaded,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
