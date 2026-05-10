export interface QuestionOption {
  id: string;
  text: string;
  textUrdu: string;
  emoji: string;
  girlScore: number;
  boyScore: number;
}

export interface Question {
  id: string;
  category: string;
  categoryUrdu: string;
  text: string;
  textUrdu: string;
  options: QuestionOption[];
}

export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    category: 'Cravings',
    categoryUrdu: 'خواہشات',
    text: 'What do you crave most?',
    textUrdu: 'آپ کو سب سے زیادہ کس چیز کی خواہش ہے؟',
    options: [
      { id: 'a', text: 'Sweet things', textUrdu: 'میٹھی چیزیں', emoji: '🍰', girlScore: 2, boyScore: 0 },
      { id: 'b', text: 'Salty snacks', textUrdu: 'نمکین اسنیکس', emoji: '🧂', girlScore: 0, boyScore: 2 },
      { id: 'c', text: 'Spicy food', textUrdu: 'مسالہ دار کھانا', emoji: '🌶️', girlScore: 0, boyScore: 1 },
      { id: 'd', text: 'Sour things', textUrdu: 'کھٹی چیزیں', emoji: '🍋', girlScore: 1, boyScore: 0 },
    ],
  },
  {
    id: 'q2',
    category: 'Cravings',
    categoryUrdu: 'خواہشات',
    text: 'How often do you drink cold beverages?',
    textUrdu: 'آپ کتنی بار ٹھنڈے مشروبات پیتی ہیں؟',
    options: [
      { id: 'a', text: 'All the time', textUrdu: 'ہر وقت', emoji: '🧊', girlScore: 0, boyScore: 2 },
      { id: 'b', text: 'Sometimes', textUrdu: 'کبھی کبھی', emoji: '😊', girlScore: 1, boyScore: 1 },
      { id: 'c', text: 'Rarely', textUrdu: 'شاذونادر', emoji: '☕', girlScore: 2, boyScore: 0 },
    ],
  },
  {
    id: 'q3',
    category: 'Mood',
    categoryUrdu: 'مزاج',
    text: 'How would you describe your mood lately?',
    textUrdu: 'آج کل آپ کا مزاج کیسا ہے؟',
    options: [
      { id: 'a', text: 'Very emotional', textUrdu: 'بہت جذباتی', emoji: '😢', girlScore: 2, boyScore: 0 },
      { id: 'b', text: 'Calm & steady', textUrdu: 'پرسکون', emoji: '😌', girlScore: 0, boyScore: 2 },
      { id: 'c', text: 'Easily irritated', textUrdu: 'جلدی چڑچڑاپن', emoji: '😤', girlScore: 1, boyScore: 1 },
      { id: 'd', text: 'Mostly happy', textUrdu: 'زیادہ تر خوش', emoji: '😄', girlScore: 1, boyScore: 1 },
    ],
  },
  {
    id: 'q4',
    category: 'Mood',
    categoryUrdu: 'مزاج',
    text: 'How is your stress level?',
    textUrdu: 'آپ کا تناؤ کی سطح کیسی ہے؟',
    options: [
      { id: 'a', text: 'High stress', textUrdu: 'زیادہ تناؤ', emoji: '😰', girlScore: 2, boyScore: 0 },
      { id: 'b', text: 'Moderate', textUrdu: 'اعتدال میں', emoji: '😐', girlScore: 1, boyScore: 1 },
      { id: 'c', text: 'Low stress', textUrdu: 'کم تناؤ', emoji: '😎', girlScore: 0, boyScore: 2 },
    ],
  },
  {
    id: 'q5',
    category: 'Body Changes',
    categoryUrdu: 'جسمانی تبدیلیاں',
    text: 'How bad is your morning sickness?',
    textUrdu: 'صبح کی متلی کتنی شدید ہے؟',
    options: [
      { id: 'a', text: 'Very severe', textUrdu: 'بہت شدید', emoji: '🤢', girlScore: 3, boyScore: 0 },
      { id: 'b', text: 'Mild', textUrdu: 'ہلکی', emoji: '😷', girlScore: 1, boyScore: 1 },
      { id: 'c', text: 'None at all', textUrdu: 'بالکل نہیں', emoji: '✅', girlScore: 0, boyScore: 2 },
    ],
  },
  {
    id: 'q6',
    category: 'Body Changes',
    categoryUrdu: 'جسمانی تبدیلیاں',
    text: 'How is your skin?',
    textUrdu: 'آپ کی جلد کیسی ہے؟',
    options: [
      { id: 'a', text: 'Glowing & clear', textUrdu: 'چمکدار', emoji: '✨', girlScore: 2, boyScore: 0 },
      { id: 'b', text: 'Breaking out', textUrdu: 'کیل مہاسے', emoji: '😬', girlScore: 1, boyScore: 1 },
      { id: 'c', text: 'Dry & dull', textUrdu: 'خشک اور بے رونق', emoji: '😞', girlScore: 0, boyScore: 2 },
    ],
  },
  {
    id: 'q7',
    category: 'Body Changes',
    categoryUrdu: 'جسمانی تبدیلیاں',
    text: 'How is your hair texture?',
    textUrdu: 'آپ کے بالوں کی ساخت کیسی ہے؟',
    options: [
      { id: 'a', text: 'Shiny & full', textUrdu: 'چمکدار', emoji: '💆', girlScore: 2, boyScore: 0 },
      { id: 'b', text: 'Dull & thin', textUrdu: 'بے رنگ', emoji: '😔', girlScore: 0, boyScore: 2 },
      { id: 'c', text: 'No change', textUrdu: 'کوئی تبدیلی نہیں', emoji: '👍', girlScore: 1, boyScore: 1 },
    ],
  },
  {
    id: 'q8',
    category: 'Energy',
    categoryUrdu: 'توانائی',
    text: 'How is your energy level?',
    textUrdu: 'آپ کی توانائی کی سطح کیسی ہے؟',
    options: [
      { id: 'a', text: 'Very active', textUrdu: 'بہت متحرک', emoji: '⚡', girlScore: 0, boyScore: 2 },
      { id: 'b', text: 'Moderate', textUrdu: 'اعتدال میں', emoji: '🚶', girlScore: 1, boyScore: 1 },
      { id: 'c', text: 'Tired & lazy', textUrdu: 'تھکا ہوا', emoji: '😴', girlScore: 2, boyScore: 0 },
    ],
  },
  {
    id: 'q9',
    category: 'Energy',
    categoryUrdu: 'توانائی',
    text: 'How much are you sleeping?',
    textUrdu: 'آپ کتنا سو رہی ہیں؟',
    options: [
      { id: 'a', text: 'A lot more', textUrdu: 'بہت زیادہ', emoji: '😴', girlScore: 2, boyScore: 0 },
      { id: 'b', text: 'Same as before', textUrdu: 'پہلے جیسا', emoji: '😊', girlScore: 0, boyScore: 1 },
      { id: 'c', text: 'Less than usual', textUrdu: 'معمول سے کم', emoji: '😵', girlScore: 0, boyScore: 2 },
    ],
  },
  {
    id: 'q10',
    category: 'Belly Shape',
    categoryUrdu: 'پیٹ کی شکل',
    text: 'Where is your baby bump positioned?',
    textUrdu: 'آپ کا بیبی بمپ کہاں ہے؟',
    options: [
      { id: 'a', text: 'High up', textUrdu: 'اوپر', emoji: '⬆️', girlScore: 2, boyScore: 0 },
      { id: 'b', text: 'Low down', textUrdu: 'نیچے', emoji: '⬇️', girlScore: 0, boyScore: 2 },
      { id: 'c', text: 'In the middle', textUrdu: 'درمیان میں', emoji: '↔️', girlScore: 1, boyScore: 1 },
    ],
  },
  {
    id: 'q11',
    category: 'Belly Shape',
    categoryUrdu: 'پیٹ کی شکل',
    text: 'What shape is your belly?',
    textUrdu: 'آپ کا پیٹ کس شکل کا ہے؟',
    options: [
      { id: 'a', text: 'Round like a watermelon', textUrdu: 'تربوز کی طرح گول', emoji: '🍉', girlScore: 2, boyScore: 0 },
      { id: 'b', text: 'Pointed outward', textUrdu: 'آگے کی طرف نوکیلا', emoji: '🏈', girlScore: 0, boyScore: 2 },
      { id: 'c', text: 'Wide on sides', textUrdu: 'اطراف میں چوڑا', emoji: '🫃', girlScore: 1, boyScore: 1 },
    ],
  },
  {
    id: 'q12',
    category: 'Walking',
    categoryUrdu: 'چلنا',
    text: 'How is your walking?',
    textUrdu: 'آپ کا چلنا کیسا ہے؟',
    options: [
      { id: 'a', text: 'Much slower now', textUrdu: 'بہت سست', emoji: '🐢', girlScore: 2, boyScore: 0 },
      { id: 'b', text: 'Same as before', textUrdu: 'پہلے جیسا', emoji: '🚶', girlScore: 0, boyScore: 1 },
      { id: 'c', text: 'A bit clumsy', textUrdu: 'تھوڑا بھدا', emoji: '🤸', girlScore: 0, boyScore: 1 },
    ],
  },
  {
    id: 'q13',
    category: 'Walking',
    categoryUrdu: 'چلنا',
    text: 'Do you have back pain while walking?',
    textUrdu: 'کیا چلتے وقت کمر میں درد ہوتا ہے؟',
    options: [
      { id: 'a', text: 'Yes, frequently', textUrdu: 'ہاں، اکثر', emoji: '😣', girlScore: 2, boyScore: 0 },
      { id: 'b', text: 'Occasionally', textUrdu: 'کبھی کبھار', emoji: '😕', girlScore: 1, boyScore: 1 },
      { id: 'c', text: 'Rarely', textUrdu: 'شاذونادر', emoji: '💪', girlScore: 0, boyScore: 2 },
    ],
  },
  {
    id: 'q14',
    category: 'Cravings',
    categoryUrdu: 'خواہشات',
    text: 'Do you prefer hot or cold food?',
    textUrdu: 'آپ گرم یا ٹھنڈا کھانا پسند کرتی ہیں؟',
    options: [
      { id: 'a', text: 'Hot meals', textUrdu: 'گرم کھانا', emoji: '🍲', girlScore: 2, boyScore: 0 },
      { id: 'b', text: 'Cold meals', textUrdu: 'ٹھنڈا کھانا', emoji: '🥗', girlScore: 0, boyScore: 2 },
      { id: 'c', text: 'Either works', textUrdu: 'کوئی بھی چلے', emoji: '🤷', girlScore: 1, boyScore: 1 },
    ],
  },
  {
    id: 'q15',
    category: 'Body Changes',
    categoryUrdu: 'جسمانی تبدیلیاں',
    text: "How has your appetite changed?",
    textUrdu: 'آپ کی بھوک میں کیا تبدیلی آئی ہے؟',
    options: [
      { id: 'a', text: 'Much more hungry', textUrdu: 'بہت زیادہ بھوک', emoji: '🍽️', girlScore: 0, boyScore: 2 },
      { id: 'b', text: 'About the same', textUrdu: 'پہلے جیسا', emoji: '😊', girlScore: 1, boyScore: 1 },
      { id: 'c', text: 'Less appetite', textUrdu: 'بھوک کم', emoji: '😔', girlScore: 2, boyScore: 0 },
    ],
  },
];

export const CATEGORY_ICONS: Record<string, string> = {
  Cravings: 'nutrition',
  Mood: 'happy',
  'Body Changes': 'body',
  Energy: 'flash',
  'Belly Shape': 'ellipse',
  Walking: 'walk',
};
