import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import * as Haptics from 'expo-haptics';

function SettingRow({
  icon,
  label,
  value,
  onPress,
  destructive,
  colors,
}: {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
  colors: any;
}) {
  return (
    <TouchableOpacity
      style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.rowIcon, { backgroundColor: destructive ? '#EF444422' : colors.primaryLight }]}>
        <Ionicons name={icon as any} size={18} color={destructive ? '#EF4444' : colors.primary} />
      </View>
      <Text style={[styles.rowLabel, { color: destructive ? '#EF4444' : colors.foreground }]}>
        {label}
      </Text>
      {value ? (
        <Text style={[styles.rowValue, { color: colors.mutedForeground }]}>{value}</Text>
      ) : (
        <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { language, setLanguage, predictions, clearHistory } = useApp();
  const isUrdu = language === 'ur';

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const handleLanguage = () => {
    const newLang = language === 'en' ? 'ur' : 'en';
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLanguage(newLang);
  };

  const handleClearHistory = () => {
    Alert.alert(
      isUrdu ? 'تاریخ صاف کریں' : 'Clear History',
      isUrdu ? 'کیا آپ واقعی تمام پیشگوئیاں حذف کرنا چاہتے ہیں؟' : 'Delete all predictions?',
      [
        { text: isUrdu ? 'منسوخ' : 'Cancel', style: 'cancel' },
        {
          text: isUrdu ? 'حذف کریں' : 'Delete All',
          style: 'destructive',
          onPress: () => {
            clearHistory();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          {isUrdu ? 'پروفائل' : 'Profile'}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 24 }]}
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
            <Text style={styles.avatarEmoji}>👶</Text>
          </View>
          <Text style={[styles.appName, { color: colors.foreground }]}>BabyGuess AI</Text>
          <Text style={[styles.appSub, { color: colors.mutedForeground }]}>
            {predictions.length} {isUrdu ? 'پیشگوئیاں' : 'predictions made'}
          </Text>
        </View>

        {/* Settings */}
        <Text style={[styles.section, { color: colors.mutedForeground }]}>
          {isUrdu ? 'ترتیبات' : 'Settings'}
        </Text>

        <SettingRow
          icon="language"
          label={isUrdu ? 'زبان تبدیل کریں' : 'Language'}
          value={language === 'en' ? 'English' : 'اردو'}
          onPress={handleLanguage}
          colors={colors}
        />

        <Text style={[styles.section, { color: colors.mutedForeground }]}>
          {isUrdu ? 'ڈیٹا' : 'Data'}
        </Text>

        <SettingRow
          icon="trash-outline"
          label={isUrdu ? 'تاریخ حذف کریں' : 'Clear History'}
          onPress={handleClearHistory}
          destructive
          colors={colors}
        />

        {/* Disclaimer */}
        <Text style={[styles.section, { color: colors.mutedForeground }]}>
          {isUrdu ? 'اہم معلومات' : 'About'}
        </Text>

        <View style={[styles.disclaimerBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="heart" size={20} color={colors.primary} style={{ marginBottom: 8 }} />
          <Text style={[styles.disclaimerTitle, { color: colors.foreground }]}>
            {isUrdu ? 'طبی ڈس کلیمر' : 'Medical Disclaimer'}
          </Text>
          <Text style={[styles.disclaimerText, { color: colors.mutedForeground }, isUrdu && styles.rtl]}>
            {isUrdu
              ? 'یہ ایپ روایتی حمل کے خرافات اور نمونوں پر مبنی تفریحی پیشگوئی فراہم کرتی ہے۔ یہ طبی طور پر درست نہیں ہے اور طبی مشورے کا متبادل نہیں ہے۔'
              : 'BabyGuess AI provides entertainment predictions based on traditional pregnancy myths and patterns. It is NOT medically accurate and should NOT be used as a substitute for medical advice. Always consult a qualified healthcare provider.'}
          </Text>
        </View>

        <Text style={[styles.version, { color: colors.mutedForeground }]}>
          BabyGuess AI v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 22, fontFamily: 'Nunito_800ExtraBold' },
  scroll: { padding: 20, gap: 10 },
  avatarSection: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 44 },
  appName: { fontSize: 20, fontFamily: 'Nunito_800ExtraBold' },
  appSub: { fontSize: 13, fontFamily: 'Nunito_400Regular' },
  section: {
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 8,
    marginBottom: 4,
    paddingLeft: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: { flex: 1, fontSize: 15, fontFamily: 'Nunito_600SemiBold' },
  rowValue: { fontSize: 14, fontFamily: 'Nunito_400Regular' },
  disclaimerBox: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  disclaimerTitle: { fontSize: 15, fontFamily: 'Nunito_700Bold', marginBottom: 6 },
  disclaimerText: { fontSize: 13, fontFamily: 'Nunito_400Regular', textAlign: 'center', lineHeight: 20 },
  rtl: { textAlign: 'right', writingDirection: 'rtl' },
  version: { fontSize: 12, fontFamily: 'Nunito_400Regular', textAlign: 'center', marginTop: 8 },
});
