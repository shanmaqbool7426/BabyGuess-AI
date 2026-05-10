# BabyGuess AI

A fun AI-powered mobile app that predicts baby gender based on traditional pregnancy symptoms, cravings, and mood patterns using a weighted scoring system.

## Architecture

- **Frontend**: React Native + Expo (SDK 53), Expo Router for navigation, running on port 5000 (web) or 8081 (native)
- **Backend**: Node.js + Express on port 3001 (optional — app works fully offline with AsyncStorage)
- **State**: React Context + AsyncStorage for persistence

## Workflows

- **Start Frontend**: `DANGEROUSLY_DISABLE_HOST_CHECK=true npx expo start --web --port 5000`
- **Start Backend**: `cd server && npm install && node index.js`

## Key Features

1. Beautiful animated onboarding (3 slides)
2. 15-question AI quiz with smooth transitions
3. Weighted prediction engine (girl/boy score + confidence %)
4. Animated result screen with shareable card
5. Prediction history saved locally
6. English + Urdu language support

## Tech Stack

- Expo Router v4 (file-based routing)
- Nunito font (cute, friendly feel)
- Pink/blue gradient theme
- expo-linear-gradient, expo-haptics, expo-sharing
- @tanstack/react-query for server state
- AsyncStorage for local persistence

## User Preferences

- Language support: English + Urdu
- Medical disclaimer must always be visible
- Entertainment-only positioning (NOT medical advice)
