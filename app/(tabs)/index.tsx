import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';

const { width } = Dimensions.get('window');

function FloatingParticle({ delay, x }: { delay: number; x: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration: 2800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 2800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -18] });
  const opacity = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.6, 1, 0.6] });

  return (
    <Animated.Text
      style={[styles.particle, { left: x, opacity, transform: [{ translateY }] }]}
    >
      ✨
    </Animated.Text>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { language, predictions } = useApp();
  const isUrdu = language === 'ur';

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const latestPrediction = predictions[0];

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/quiz');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={['#FF6B9D', '#D946EF', '#818CF8']}
          style={[styles.hero, { paddingTop: topPad + 20 }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <FloatingParticle delay={0} x={30} />
          <FloatingParticle delay={600} x={width * 0.5} />
          <FloatingParticle delay={1200} x={width * 0.75} />

          <Text style={styles.heroEmoji}>👶</Text>
          <Text style={[styles.heroTitle, isUrdu && styles.rtl]}>
            {isUrdu ? 'بیبی گیس اے آئی' : 'BabyGuess AI'}
          </Text>
          <Text style={[styles.heroSubtitle, isUrdu && styles.rtl]}>
            {isUrdu
              ? 'اپنے بچے کی جنس کے بارے میں پیشگوئی کریں'
              : 'Discover your baby prediction'}
          </Text>

          {/* CTA Button */}
          <TouchableOpacity style={styles.ctaBtn} onPress={handleStart} activeOpacity={0.88}>
            <View style={styles.ctaInner}>
              <Ionicons name="sparkles" size={20} color="#E91E8C" />
              <Text style={styles.ctaText}>
                {isUrdu ? 'پیشگوئی شروع کریں' : 'Start Prediction'}
              </Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.body}>
          {/* Disclaimer */}
          <View style={[styles.disclaimerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="information-circle" size={18} color={colors.mutedForeground} />
            <Text style={[styles.disclaimerText, { color: colors.mutedForeground }, isUrdu && styles.rtl]}>
              {isUrdu
                ? 'یہ روایتی حمل کے خرافات پر مبنی تفریحی اے آئی پیشگوئی ہے۔ یہ طبی طور پر درست نہیں ہے۔'
                : 'Entertainment prediction based on traditional myths. NOT medically accurate.'}
            </Text>
          </View>

          {/* How it works */}
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            {isUrdu ? 'یہ کیسے کام کرتا ہے' : 'How It Works'}
          </Text>
          <View style={styles.stepsGrid}>
            {[
              { icon: 'chatbubble-ellipses', label: isUrdu ? '15 سوالات' : '15 Questions', color: '#FF6B9D' },
              { icon: 'analytics', label: isUrdu ? 'اے آئی تجزیہ' : 'AI Analysis', color: '#A855F7' },
              { icon: 'ribbon', label: isUrdu ? 'نتیجہ' : 'Prediction', color: '#3B82F6' },
            ].map((step, i) => (
              <View key={i} style={[styles.stepCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.stepIcon, { backgroundColor: step.color + '22' }]}>
                  <Ionicons name={step.icon as any} size={22} color={step.color} />
                </View>
                <Text style={[styles.stepNum, { color: colors.mutedForeground }]}>{i + 1}</Text>
                <Text style={[styles.stepLabel, { color: colors.foreground }]}>{step.label}</Text>
              </View>
            ))}
          </View>

          {/* Latest Prediction */}
          {latestPrediction && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                {isUrdu ? 'آخری پیشگوئی' : 'Latest Prediction'}
              </Text>
              <TouchableOpacity
                style={[styles.latestCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => router.push('/history')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={latestPrediction.result === 'girl' ? ['#FF6B9D22', '#C44FD822'] : ['#3B82F622', '#7C3AED22']}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <Text style={styles.latestEmoji}>
                  {latestPrediction.result === 'girl' ? '👧' : '👦'}
                </Text>
                <View style={styles.latestInfo}>
                  <Text style={[styles.latestResult, { color: latestPrediction.result === 'girl' ? '#E91E8C' : '#3B82F6' }]}>
                    {latestPrediction.result === 'girl'
                      ? (isUrdu ? 'بیبی گرل' : 'Baby Girl')
                      : (isUrdu ? 'بیبی بوائے' : 'Baby Boy')}
                  </Text>
                  <Text style={[styles.latestConf, { color: colors.mutedForeground }]}>
                    {latestPrediction.confidence}% {isUrdu ? 'اعتماد' : 'confidence'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
              </TouchableOpacity>
            </>
          )}

          <View style={{ height: 32 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    paddingHorizontal: 28,
    paddingBottom: 48,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  particle: { position: 'absolute', bottom: 20, fontSize: 16 },
  heroEmoji: { fontSize: 72, marginBottom: 12 },
  heroTitle: {
    fontSize: 32,
    fontFamily: 'Nunito_800ExtraBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 32,
  },
  ctaBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 36,
    paddingVertical: 16,
    gap: 10,
  },
  ctaText: { fontSize: 17, fontFamily: 'Nunito_800ExtraBold', color: '#E91E8C' },
  rtl: { textAlign: 'right', writingDirection: 'rtl' },
  body: { paddingHorizontal: 20, paddingTop: 20 },
  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
    marginBottom: 24,
  },
  disclaimerText: { flex: 1, fontSize: 12, fontFamily: 'Nunito_400Regular', lineHeight: 18 },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_800ExtraBold',
    marginBottom: 14,
  },
  stepsGrid: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  stepCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 6,
  },
  stepIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: { fontSize: 11, fontFamily: 'Nunito_600SemiBold' },
  stepLabel: { fontSize: 12, fontFamily: 'Nunito_700Bold', textAlign: 'center' },
  latestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    gap: 14,
    overflow: 'hidden',
    marginBottom: 8,
  },
  latestEmoji: { fontSize: 40 },
  latestInfo: { flex: 1 },
  latestResult: { fontSize: 17, fontFamily: 'Nunito_800ExtraBold' },
  latestConf: { fontSize: 13, fontFamily: 'Nunito_400Regular', marginTop: 2 },
});
