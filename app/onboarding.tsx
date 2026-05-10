import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: 0,
    title: 'BabyGuess AI',
    titleUrdu: 'بیبی گیس اے آئی',
    subtitle: 'Discover the Magic',
    subtitleUrdu: 'جادو دریافت کریں',
    body: 'A fun AI-powered experience that predicts your baby\'s gender based on traditional pregnancy patterns.',
    bodyUrdu: 'روایتی حمل کے نمونوں پر مبنی ایک تفریحی اے آئی تجربہ۔',
    emoji: '✨',
    gradient: ['#FF6B9D', '#C44FD8', '#818CF8'] as const,
  },
  {
    id: 1,
    title: 'How It Works',
    titleUrdu: 'یہ کیسے کام کرتا ہے',
    subtitle: '3 Simple Steps',
    subtitleUrdu: '3 آسان مراحل',
    body: 'Answer 15 fun questions about your cravings, mood, and body changes. Our AI analyses patterns from traditional pregnancy myths.',
    bodyUrdu: '15 مزیدار سوالات کے جوابات دیں۔ ہمارا اے آئی روایتی حمل کے نمونوں کا تجزیہ کرتا ہے۔',
    emoji: '📱',
    gradient: ['#FF9A9E', '#FAD0C4', '#FFA9C1'] as const,
    steps: ['Answer Questions', 'AI Analyses', 'Get Prediction'],
    stepsUrdu: ['سوالات کے جوابات', 'اے آئی تجزیہ', 'نتیجہ حاصل کریں'],
  },
  {
    id: 2,
    title: 'Important Note',
    titleUrdu: 'اہم نوٹ',
    subtitle: 'For Entertainment Only',
    subtitleUrdu: 'صرف تفریح کے لیے',
    body: 'This is an AI entertainment prediction based on traditional pregnancy myths. It is NOT medically accurate.',
    bodyUrdu: 'یہ روایتی حمل کے خرافات پر مبنی ایک تفریحی پیشگوئی ہے۔ یہ طبی طور پر درست نہیں ہے۔',
    emoji: '💫',
    gradient: ['#A18CD1', '#FBC2EB', '#F9A8D4'] as const,
  },
];

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { completeOnboarding, setLanguage, language } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const isUrdu = language === 'ur';
  const slide = SLIDES[currentSlide];

  const goNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentSlide < SLIDES.length - 1) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: -40, duration: 180, useNativeDriver: true }),
      ]).start(() => {
        setCurrentSlide(currentSlide + 1);
        slideAnim.setValue(40);
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
          Animated.timing(slideAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
        ]).start();
      });
    } else {
      completeOnboarding();
      router.replace('/(tabs)');
    }
  };

  const isLast = currentSlide === SLIDES.length - 1;

  return (
    <View style={[styles.container, { paddingTop: topPad, paddingBottom: bottomPad }]}>
      <LinearGradient
        colors={slide.gradient}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Language Toggle */}
      <View style={styles.langRow}>
        <TouchableOpacity
          style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
          onPress={() => setLanguage('en')}
        >
          <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>EN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.langBtn, language === 'ur' && styles.langBtnActive]}
          onPress={() => setLanguage('ur')}
        >
          <Text style={[styles.langText, language === 'ur' && styles.langTextActive]}>اردو</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <Animated.View
        style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        <Text style={styles.emoji}>{slide.emoji}</Text>
        <Text style={styles.title}>{isUrdu ? slide.titleUrdu : slide.title}</Text>
        <Text style={styles.subtitle}>{isUrdu ? slide.subtitleUrdu : slide.subtitle}</Text>
        <Text style={[styles.body, isUrdu && styles.rtl]}>
          {isUrdu ? slide.bodyUrdu : slide.body}
        </Text>

        {slide.steps && (
          <View style={styles.stepsContainer}>
            {slide.steps.map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepNum}>
                  <Text style={styles.stepNumText}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>
                  {isUrdu ? slide.stepsUrdu![i] : step}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Animated.View>

      {/* Bottom */}
      <View style={styles.bottom}>
        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === currentSlide && styles.dotActive]} />
          ))}
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.btn} onPress={goNext} activeOpacity={0.85}>
          <View style={styles.btnInner}>
            <Text style={styles.btnText}>
              {isLast
                ? isUrdu ? 'شروع کریں' : "Let's Start!"
                : isUrdu ? 'آگے' : 'Next'}
            </Text>
          </View>
        </TouchableOpacity>

        {currentSlide < SLIDES.length - 1 && (
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={() => {
              completeOnboarding();
              router.replace('/(tabs)');
            }}
          >
            <Text style={styles.skipText}>{isUrdu ? 'چھوڑیں' : 'Skip'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  langRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 12,
    gap: 8,
  },
  langBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  langBtnActive: { backgroundColor: 'rgba(255,255,255,0.9)' },
  langText: { fontSize: 13, fontFamily: 'Nunito_700Bold', color: 'rgba(255,255,255,0.8)' },
  langTextActive: { color: '#E91E8C' },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emoji: { fontSize: 72, marginBottom: 24 },
  title: {
    fontSize: 34,
    fontFamily: 'Nunito_800ExtraBold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginBottom: 20,
  },
  body: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  rtl: { textAlign: 'right', writingDirection: 'rtl' },
  stepsContainer: { marginTop: 24, width: '100%', gap: 12 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  stepNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: { fontSize: 14, fontFamily: 'Nunito_800ExtraBold', color: '#fff' },
  stepText: { fontSize: 15, fontFamily: 'Nunito_600SemiBold', color: '#fff' },
  bottom: { paddingHorizontal: 32, paddingBottom: 20, alignItems: 'center', gap: 16 },
  dots: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: { width: 24, backgroundColor: '#FFFFFF' },
  btn: {
    width: '100%',
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  btnInner: { paddingVertical: 18, alignItems: 'center' },
  btnText: { fontSize: 17, fontFamily: 'Nunito_800ExtraBold', color: '#E91E8C' },
  skipBtn: { paddingVertical: 4 },
  skipText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: 'rgba(255,255,255,0.75)',
    textDecorationLine: 'underline',
  },
});
