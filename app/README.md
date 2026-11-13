# Krishok.ai Mobile App

Expo React Native app connected to the NestJS backend in `../backend`.

## Included

- Guest chat with backend-enforced 5-question limit
- Password signup, login, logout, and persisted session
- User-specific conversation history and thread reopening
- Crop image upload
- Crop guide list and detail pages
- Disease list and treatment detail pages
- Light/dark notebook theme
- Android/iOS responsive bottom navigation and chat drawer

## API URL

Copy `.env.example` to `.env`.

Production API:

```env
EXPO_PUBLIC_API_URL=https://api.krishokai.xyz
```

## Android release

Installable APK:

```powershell
npm run build:apk
```

Play Store AAB:

```powershell
npm run build:aab
```

## Run

Start the backend:

```powershell
cd D:\projects\krishok-ai\backend
npm run start:dev
```

Start the app:

```powershell
cd D:\projects\krishok-ai\app
npm start
```

Then press `a` for Android or scan the Expo Go QR code.
