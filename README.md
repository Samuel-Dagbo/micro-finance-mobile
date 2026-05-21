# MicroFin Mobile App

React Native mobile application for the MicroFin Platform.

## Features

- **Account Activation** - Activate your account with Customer ID + phone
- **OTP Verification** - Secure email OTP verification
- **Dashboard** - Overview of savings, loans, and recent transactions
- **Savings** - View savings accounts, balances, and progress
- **Loans** - Track active loans, repayment progress, and history
- **Transactions** - Complete transaction history
- **Notifications** - In-app alerts and announcements
- **Profile** - Manage account settings and security

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator (or physical device with Expo Go)

### Installation

```bash
# Install dependencies
npm install

# Update Supabase credentials in src/config/env.ts
# Replace with your actual Supabase project URL and anon key

# Start the development server
npm start
```

### Running on Device

```bash
# iOS
npm run ios

# Android
npm run android

# Web (for testing)
npm run web
```

## Architecture

```
microfin-mobile/
├── src/
│   ├── screens/          # App screens
│   │   ├── LoginScreen.tsx
│   │   ├── ActivateScreen.tsx
│   │   ├── OtpScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── SavingsScreen.tsx
│   │   ├── LoansScreen.tsx
│   │   ├── TransactionsScreen.tsx
│   │   ├── NotificationsScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── navigation/       # React Navigation setup
│   ├── services/         # API and Supabase services
│   ├── context/          # React context (Auth)
│   ├── utils/            # Helper functions
│   └── config/           # App configuration
├── App.tsx               # Root component
└── app.json              # Expo configuration
```

## Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **React Navigation** - Navigation library
- **Supabase** - Backend and auth
- **Expo SecureStore** - Secure session storage
- **Expo LinearGradient** - Gradient backgrounds

## Security

- Sessions stored securely using Expo SecureStore
- Auto-refresh tokens enabled
- All API calls use authenticated Supabase client
- No sensitive data stored in plain text

## Deployment

### Using EAS Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

### Submit to Stores

```bash
# Submit to Google Play
eas submit --platform android

# Submit to App Store
eas submit --platform ios
```

## Environment Variables

Update `src/config/env.ts` with your Supabase credentials:

```typescript
export const SUPABASE_URL = 'https://your-project.supabase.co'
export const SUPABASE_ANON_KEY = 'your-anon-key'
```

---

*Built with React Native and Expo*
*© 2026 MicroFin Platform*
