# Caberu Mobile - First Smile AI

A React Native healthcare app for dental appointment booking and AI-powered consultations.

## Tech Stack

- **Framework**: Expo (managed workflow)
- **Navigation**: expo-router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Backend**: Supabase (auth, database, edge functions)
- **State Management**: React Query + React Context

## Features

- AI-powered dental chat assistant
- Multi-step appointment booking flow
- Push notifications for appointment reminders
- Biometric authentication support
- Multi-language support (English, French, Dutch)
- Dentist directory with profiles
- Appointment history and management
- User profile and settings

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app (for mobile testing)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Scan the QR code with Expo Go (iOS/Android) or press:
   - `i` for iOS simulator
   - `a` for Android emulator
   - `w` for web browser

## Project Structure

```
/app                      # expo-router pages
  /_layout.tsx           # Root layout with providers
  /index.tsx             # Entry redirect
  /onboarding.tsx        # Onboarding screens
  /(auth)/               # Auth group
    /login.tsx
    /register.tsx
  /(main)/               # Main app group
    /_layout.tsx         # Tab navigation
    /chat.tsx            # AI chat screen
    /appointments.tsx    # Appointments list
    /dentists.tsx        # Dentist directory
    /book.tsx            # Booking flow
    /settings.tsx        # User settings
    /appointments/[id].tsx  # Appointment detail

/components              # Reusable components
  /ui/                   # UI component library

/lib                     # Utilities
  /supabase.ts          # Supabase client
  /database.types.ts    # Database types
  /utils.ts             # Helper functions
  /notifications.ts     # Push notification utils
  /biometric.ts         # Biometric auth utils

/hooks                   # Custom React hooks
  /useAuth.tsx          # Authentication context
  /useLanguage.tsx      # i18n context
  /useToast.tsx         # Toast notifications

/assets                  # Static assets
```

## Environment Variables

Create a `.env` file:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Building for Production

```bash
# Build for Android
npm run build:android

# Build for iOS
npm run build:ios
```

## Original Web Version

The original web version was built with Vite + React + shadcn/ui. The source files are preserved in the `/src` directory for reference.

## License

Private - All rights reserved
