const lightColors = {
  primary: '#E91E8C',
  primaryLight: '#FFD6EA',
  primaryDark: '#B5006E',
  secondary: '#3B82F6',
  secondaryLight: '#DBEAFE',
  accent: '#A855F7',
  background: '#FFF9FC',
  card: '#FFFFFF',
  surface: '#FFF3F8',
  border: '#F5D0E8',
  foreground: '#1A0A2E',
  mutedForeground: '#9A7FAA',
  muted: '#F5EBF3',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  girlPink: '#E91E8C',
  boyBlue: '#3B82F6',
  girlGradient: ['#FF6B9D', '#C44FD8'] as const,
  boyGradient: ['#3B82F6', '#7C3AED'] as const,
  heroGradient: ['#FF6B9D', '#D946EF', '#818CF8'] as const,
  radius: 20,
  radiusSm: 12,
  radiusLg: 28,
};

const darkColors = {
  ...lightColors,
  background: '#0F051A',
  card: '#1A0D2E',
  surface: '#220F38',
  border: '#3D1D55',
  foreground: '#F5E6FF',
  mutedForeground: '#9A7FAA',
  muted: '#2A1040',
};

export const colors = {
  light: lightColors,
  dark: darkColors,
};

export type ColorScheme = typeof lightColors;
