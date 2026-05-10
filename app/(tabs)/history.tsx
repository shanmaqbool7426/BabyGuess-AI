import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useApp, Prediction } from '@/context/AppContext';
import * as Haptics from 'expo-haptics';

function PredictionCard({ item, isUrdu, colors }: { item: Prediction; isUrdu: boolean; colors: any }) {
  const isGirl = item.result === 'girl';
  const date = new Date(item.date).toLocaleDateString(isUrdu ? 'ur-PK' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <LinearGradient
        colors={isGirl ? ['#FF6B9D15', '#C44FD815'] : ['#3B82F615', '#7C3AED15']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <Text style={styles.cardEmoji}>{isGirl ? '👧' : '👦'}</Text>
      <View style={styles.cardBody}>
        <Text style={[styles.cardResult, { color: isGirl ? '#E91E8C' : '#3B82F6' }]}>
          {isGirl
            ? (isUrdu ? 'بیبی گرل' : 'Baby Girl')
            : (isUrdu ? 'بیبی بوائے' : 'Baby Boy')}
        </Text>
        <Text style={[styles.cardDate, { color: colors.mutedForeground }]}>{date}</Text>
        {item.factors.length > 0 && (
          <Text style={[styles.cardFactors, { color: colors.mutedForeground }]}>
            {item.factors.slice(0, 2).join(' · ')}
          </Text>
        )}
      </View>
      <View style={[styles.confBadge, { backgroundColor: (isGirl ? '#E91E8C' : '#3B82F6') + '22' }]}>
        <Text style={[styles.confText, { color: isGirl ? '#E91E8C' : '#3B82F6' }]}>
          {item.confidence}%
        </Text>
      </View>
    </View>
  );
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { language, predictions, clearHistory } = useApp();
  const isUrdu = language === 'ur';

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const handleClear = () => {
    Alert.alert(
      isUrdu ? 'تاریخ صاف کریں' : 'Clear History',
      isUrdu ? 'کیا آپ واقعی تمام پیشگوئیاں حذف کرنا چاہتے ہیں؟' : 'Are you sure you want to delete all predictions?',
      [
        { text: isUrdu ? 'منسوخ' : 'Cancel', style: 'cancel' },
        {
          text: isUrdu ? 'حذف کریں' : 'Delete',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            clearHistory();
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          {isUrdu ? 'پیشگوئی کی تاریخ' : 'Prediction History'}
        </Text>
        {predictions.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Ionicons name="trash-outline" size={22} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={predictions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PredictionCard item={item} isUrdu={isUrdu} colors={colors} />
        )}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: bottomPad + 24 },
          predictions.length === 0 && styles.emptyList,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="time-outline" size={56} color={colors.border} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              {isUrdu ? 'کوئی پیشگوئی نہیں' : 'No predictions yet'}
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>
              {isUrdu ? 'پہلی پیشگوئی شروع کریں' : 'Start your first prediction from Home'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 22, fontFamily: 'Nunito_800ExtraBold' },
  list: { padding: 16, gap: 12 },
  emptyList: { flex: 1 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
    overflow: 'hidden',
  },
  cardEmoji: { fontSize: 38 },
  cardBody: { flex: 1 },
  cardResult: { fontSize: 16, fontFamily: 'Nunito_800ExtraBold' },
  cardDate: { fontSize: 12, fontFamily: 'Nunito_400Regular', marginTop: 2 },
  cardFactors: { fontSize: 11, fontFamily: 'Nunito_400Regular', marginTop: 4 },
  confBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  confText: { fontSize: 14, fontFamily: 'Nunito_800ExtraBold' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyTitle: { fontSize: 20, fontFamily: 'Nunito_700Bold' },
  emptySubtitle: { fontSize: 14, fontFamily: 'Nunito_400Regular', textAlign: 'center' },
});
