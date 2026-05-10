import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { QUESTIONS, QuestionOption, CATEGORY_ICONS } from '@/constants/questions';

interface AnswerMap {
  [questionId: string]: QuestionOption;
}

function OptionCard({
  option,
  selected,
  onPress,
  isUrdu,
  colors,
}: {
  option: QuestionOption;
  selected: boolean;
  onPress: () => void;
  isUrdu: boolean;
  colors: any;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[
          styles.optionCard,
          {
            backgroundColor: selected ? colors.primaryLight : colors.card,
            borderColor: selected ? colors.primary : colors.border,
          },
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {selected && (
          <LinearGradient
            colors={['#FF6B9D18', '#E91E8C08']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        )}
        <Text style={styles.optionEmoji}>{option.emoji}</Text>
        <Text
          style={[
            styles.optionText,
            { color: selected ? colors.primary : colors.foreground },
            isUrdu && styles.rtl,
          ]}
        >
          {isUrdu ? option.textUrdu : option.text}
        </Text>
        {selected && (
          <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function QuizScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { language } = useApp();
  const isUrdu = language === 'ur';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const question = QUESTIONS[currentIndex];
  const progress = (currentIndex + 1) / QUESTIONS.length;
  const isLast = currentIndex === QUESTIONS.length - 1;

  const animateTransition = (direction: 'forward' | 'back', callback: () => void) => {
    const outX = direction === 'forward' ? -30 : 30;
    const inX = direction === 'forward' ? 30 : -30;
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: outX, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      callback();
      slideAnim.setValue(inX);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();
    });
  };

  const handleSelectOption = (option: QuestionOption) => {
    setSelectedId(option.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const getKeyFactors = (ans: AnswerMap): string[] => {
    const factors: string[] = [];
    const vals = Object.values(ans);
    const cravingAnswers = Object.entries(ans)
      .filter(([k]) => k === 'q1' || k === 'q2' || k === 'q14')
      .map(([, v]) => v);
    const moodAnswers = Object.entries(ans)
      .filter(([k]) => k === 'q3' || k === 'q4')
      .map(([, v]) => v);

    if (cravingAnswers.some(o => o.girlScore >= 2)) factors.push('Sweet cravings');
    if (cravingAnswers.some(o => o.boyScore >= 2)) factors.push('Salty cravings');
    if (moodAnswers.some(o => o.girlScore >= 2)) factors.push('Emotional mood');
    if (moodAnswers.some(o => o.boyScore >= 2)) factors.push('Calm mood');
    if (ans['q5']?.girlScore >= 3) factors.push('Severe morning sickness');
    if (ans['q5']?.boyScore >= 2) factors.push('No morning sickness');
    if (ans['q6']?.girlScore >= 2) factors.push('Face glow');
    if (ans['q8']?.boyScore >= 2) factors.push('High energy');
    if (ans['q10']?.girlScore >= 2) factors.push('High belly position');
    if (ans['q10']?.boyScore >= 2) factors.push('Low belly position');
    if (ans['q11']?.girlScore >= 2) factors.push('Round belly shape');
    if (ans['q11']?.boyScore >= 2) factors.push('Pointed belly shape');

    return factors.slice(0, 4);
  };

  const handleNext = () => {
    if (!selectedId) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const selectedOption = question.options.find(o => o.id === selectedId)!;
    const newAnswers = { ...answers, [question.id]: selectedOption };

    if (isLast) {
      const girlScore = Object.values(newAnswers).reduce((s, o) => s + o.girlScore, 0);
      const boyScore = Object.values(newAnswers).reduce((s, o) => s + o.boyScore, 0);
      const factors = getKeyFactors(newAnswers);

      router.replace({
        pathname: '/result',
        params: {
          girlScore: girlScore.toString(),
          boyScore: boyScore.toString(),
          factors: JSON.stringify(factors),
        },
      });
    } else {
      setAnswers(newAnswers);
      animateTransition('forward', () => {
        setCurrentIndex(currentIndex + 1);
        const nextQ = QUESTIONS[currentIndex + 1];
        setSelectedId(newAnswers[nextQ.id]?.id ?? null);
      });
    }
  };

  const handleBack = () => {
    if (currentIndex === 0) {
      router.back();
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    animateTransition('back', () => {
      const prevQ = QUESTIONS[currentIndex - 1];
      setCurrentIndex(currentIndex - 1);
      setSelectedId(answers[prevQ.id]?.id ?? null);
    });
  };

  const categoryIcon = CATEGORY_ICONS[question.category] ?? 'help-circle';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={['#FF6B9D', '#D946EF']}
        style={[styles.headerBg, { paddingTop: topPad }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerProgress}>
            {currentIndex + 1} / {QUESTIONS.length}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressTrack}>
          <Animated.View
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 24 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateX: slideAnim }] }}>
          {/* Category */}
          <View style={[styles.categoryRow, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name={categoryIcon as any} size={14} color={colors.primary} />
            <Text style={[styles.categoryText, { color: colors.primary }]}>
              {isUrdu ? question.categoryUrdu : question.category}
            </Text>
          </View>

          {/* Question */}
          <Text style={[styles.questionText, { color: colors.foreground }, isUrdu && styles.rtl]}>
            {isUrdu ? question.textUrdu : question.text}
          </Text>

          {/* Options */}
          <View style={styles.options}>
            {question.options.map((option) => (
              <OptionCard
                key={option.id}
                option={option}
                selected={selectedId === option.id}
                onPress={() => handleSelectOption(option)}
                isUrdu={isUrdu}
                colors={colors}
              />
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Next Button */}
      <View style={[styles.footer, { paddingBottom: bottomPad + 16, backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.nextBtn, !selectedId && styles.nextBtnDisabled]}
          onPress={handleNext}
          disabled={!selectedId}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={selectedId ? ['#FF6B9D', '#C44FD8'] : [colors.muted, colors.muted]}
            style={styles.nextGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={[styles.nextText, !selectedId && { color: colors.mutedForeground }]}>
              {isLast
                ? (isUrdu ? 'نتیجہ دیکھیں' : 'See Result')
                : (isUrdu ? 'آگے' : 'Next')}
            </Text>
            <Ionicons
              name={isLast ? 'sparkles' : 'arrow-forward'}
              size={18}
              color={selectedId ? '#fff' : colors.mutedForeground}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBg: { paddingBottom: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerProgress: {
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
    color: '#fff',
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 20,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  scroll: { padding: 20 },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  categoryText: { fontSize: 12, fontFamily: 'Nunito_700Bold' },
  questionText: {
    fontSize: 22,
    fontFamily: 'Nunito_800ExtraBold',
    lineHeight: 32,
    marginBottom: 24,
  },
  rtl: { textAlign: 'right', writingDirection: 'rtl' },
  options: { gap: 12 },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 2,
    gap: 14,
    overflow: 'hidden',
  },
  optionEmoji: { fontSize: 28 },
  optionText: { flex: 1, fontSize: 15, fontFamily: 'Nunito_600SemiBold', lineHeight: 22 },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  nextBtn: { borderRadius: 24, overflow: 'hidden' },
  nextBtnDisabled: { opacity: 0.6 },
  nextGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  nextText: { fontSize: 17, fontFamily: 'Nunito_800ExtraBold', color: '#FFFFFF' },
});
