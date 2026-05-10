import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
  Share,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';

export default function ResultScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { language, addPrediction } = useApp();
  const isUrdu = language === 'ur';

  const { girlScore: gs, boyScore: bs, factors: factorsParam } = useLocalSearchParams<{
    girlScore: string;
    boyScore: string;
    factors: string;
  }>();

  const girlScore = parseInt(gs ?? '0', 10);
  const boyScore = parseInt(bs ?? '0', 10);
  const factors: string[] = factorsParam ? JSON.parse(factorsParam) : [];
  const total = girlScore + boyScore;
  const isGirl = girlScore >= boyScore;
  const confidence = total > 0 ? Math.round((Math.max(girlScore, boyScore) / total) * 100) : 50;

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  // Animations
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const confAnim = useRef(new Animated.Value(0)).current;
  const savedRef = useRef(false);

  useEffect(() => {
    // Save prediction once
    if (!savedRef.current) {
      savedRef.current = true;
      addPrediction({
        result: isGirl ? 'girl' : 'boy',
        confidence,
        girlScore,
        boyScore,
        factors,
      });
    }

    Haptics.notificationAsync(
      isGirl
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Success
    );

    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      Animated.timing(confAnim, {
        toValue: confidence / 100,
        duration: 800,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const resultText = isGirl ? '👧 Baby Girl' : '👦 Baby Boy';
    const message = `✨ BabyGuess AI Prediction ✨\n\n${resultText}\nConfidence: ${confidence}%\n\nKey factors: ${factors.join(', ')}\n\n⚠️ This is an entertainment prediction based on traditional myths. Not medically accurate.\n\nTry it yourself: BabyGuess AI`;
    try {
      await Share.share({ message });
    } catch {}
  };

  const handleRetake = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/quiz');
  };

  const handleHome = () => {
    router.replace('/(tabs)');
  };

  const gradientColors = isGirl
    ? (['#FF6B9D', '#C44FD8', '#818CF8'] as const)
    : (['#3B82F6', '#7C3AED', '#A855F7'] as const);

  const confBarWidth = confAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const factorLabels: Record<string, string> = {
    'Sweet cravings': isUrdu ? 'میٹھے کی خواہش' : 'Sweet cravings',
    'Salty cravings': isUrdu ? 'نمکین کی خواہش' : 'Salty cravings',
    'Emotional mood': isUrdu ? 'جذباتی مزاج' : 'Emotional mood',
    'Calm mood': isUrdu ? 'پرسکون مزاج' : 'Calm mood',
    'Severe morning sickness': isUrdu ? 'شدید متلی' : 'Severe morning sickness',
    'No morning sickness': isUrdu ? 'متلی نہیں' : 'No morning sickness',
    'Face glow': isUrdu ? 'چہرے کی چمک' : 'Face glow',
    'High energy': isUrdu ? 'زیادہ توانائی' : 'High energy',
    'High belly position': isUrdu ? 'پیٹ اوپر' : 'High belly position',
    'Low belly position': isUrdu ? 'پیٹ نیچے' : 'Low belly position',
    'Round belly shape': isUrdu ? 'گول پیٹ' : 'Round belly shape',
    'Pointed belly shape': isUrdu ? 'نوکیلا پیٹ' : 'Pointed belly shape',
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Close button */}
      <View style={[styles.topBar, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity style={styles.closeBtn} onPress={handleHome}>
          <Ionicons name="close" size={22} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 24 }]}
      >
        {/* Result Card */}
        <Animated.View style={[styles.resultCard, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient
            colors={gradientColors}
            style={styles.resultGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.sparkle}>✨</Text>
            <Text style={[styles.aiLabel]}>
              {isUrdu ? 'اے آئی پیشگوئی' : 'AI Prediction Result'}
            </Text>
            <Text style={styles.babyEmoji}>{isGirl ? '👧' : '👦'}</Text>
            <Text style={styles.predictionText}>
              {isGirl
                ? (isUrdu ? 'ممکنہ بیبی گرل' : 'Possible Baby Girl')
                : (isUrdu ? 'ممکنہ بیبی بوائے' : 'Possible Baby Boy')}
            </Text>
            <Text style={styles.sparkle}>✨</Text>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Confidence */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              {isUrdu ? 'اعتماد کی سطح' : 'Confidence Level'}
            </Text>
            <View style={styles.confRow}>
              <Text style={[styles.confNum, { color: isGirl ? colors.girlPink : colors.boyBlue }]}>
                {confidence}%
              </Text>
            </View>
            <View style={[styles.confTrack, { backgroundColor: colors.muted }]}>
              <Animated.View
                style={[
                  styles.confFill,
                  {
                    width: confBarWidth,
                    backgroundColor: isGirl ? colors.girlPink : colors.boyBlue,
                  },
                ]}
              />
            </View>
            <Text style={[styles.confSubtitle, { color: colors.mutedForeground }]}>
              {confidence >= 65
                ? (isUrdu ? 'اعلی اعتماد' : 'Strong signal')
                : confidence >= 50
                ? (isUrdu ? 'درمیانی اعتماد' : 'Moderate signal')
                : (isUrdu ? 'ملی جلی علامات' : 'Mixed signals')}
            </Text>
          </View>

          {/* Key Factors */}
          {factors.length > 0 && (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.cardTitle, { color: colors.foreground }]}>
                {isUrdu ? 'اہم عوامل' : 'Key Factors'}
              </Text>
              <View style={styles.factors}>
                {factors.map((f, i) => (
                  <View
                    key={i}
                    style={[
                      styles.factorChip,
                      { backgroundColor: (isGirl ? colors.girlPink : colors.boyBlue) + '20' },
                    ]}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={14}
                      color={isGirl ? colors.girlPink : colors.boyBlue}
                    />
                    <Text
                      style={[
                        styles.factorText,
                        { color: isGirl ? colors.girlPink : colors.boyBlue },
                        isUrdu && styles.rtl,
                      ]}
                    >
                      {factorLabels[f] ?? f}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Disclaimer */}
          <View style={[styles.disclaimerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="information-circle-outline" size={16} color={colors.mutedForeground} />
            <Text style={[styles.disclaimerText, { color: colors.mutedForeground }, isUrdu && styles.rtl]}>
              {isUrdu
                ? 'یہ روایتی حمل کے خرافات پر مبنی تفریحی پیشگوئی ہے۔ طبی طور پر درست نہیں ہے۔'
                : 'This is an AI entertainment prediction based on traditional pregnancy myths. NOT medically accurate.'}
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.shareBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
              onPress={handleShare}
              activeOpacity={0.8}
            >
              <Ionicons name="share-social-outline" size={20} color={colors.primary} />
              <Text style={[styles.shareBtnText, { color: colors.primary }]}>
                {isUrdu ? 'شیئر کریں' : 'Share'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.retakeBtn}
              onPress={handleRetake}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#FF6B9D', '#C44FD8']}
                style={styles.retakeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="refresh" size={18} color="#fff" />
                <Text style={styles.retakeBtnText}>
                  {isUrdu ? 'دوبارہ کریں' : 'Retake Quiz'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    paddingHorizontal: 20,
    paddingBottom: 4,
    alignItems: 'flex-end',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#00000010',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { padding: 20, gap: 16 },
  resultCard: { borderRadius: 28, overflow: 'hidden', marginBottom: 4 },
  resultGradient: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    gap: 4,
  },
  sparkle: { fontSize: 22 },
  aiLabel: {
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  babyEmoji: { fontSize: 80, marginVertical: 8 },
  predictionText: {
    fontSize: 28,
    fontFamily: 'Nunito_800ExtraBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  card: {
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    gap: 12,
  },
  cardTitle: { fontSize: 16, fontFamily: 'Nunito_800ExtraBold' },
  confRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  confNum: { fontSize: 48, fontFamily: 'Nunito_800ExtraBold' },
  confTrack: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  confFill: { height: '100%', borderRadius: 5 },
  confSubtitle: { fontSize: 13, fontFamily: 'Nunito_400Regular' },
  factors: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  factorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  factorText: { fontSize: 13, fontFamily: 'Nunito_600SemiBold' },
  rtl: { textAlign: 'right', writingDirection: 'rtl' },
  disclaimerCard: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  disclaimerText: { flex: 1, fontSize: 12, fontFamily: 'Nunito_400Regular', lineHeight: 18 },
  btnRow: { flexDirection: 'row', gap: 12 },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  shareBtnText: { fontSize: 15, fontFamily: 'Nunito_700Bold' },
  retakeBtn: { flex: 2, borderRadius: 20, overflow: 'hidden' },
  retakeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  retakeBtnText: { fontSize: 15, fontFamily: 'Nunito_700Bold', color: '#fff' },
});
