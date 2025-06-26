# Firebase Setup Guide

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "habit-tracker")
4. Follow the setup wizard (you can disable Google Analytics for now)

## 2. Enable Firestore Database

1. In your Firebase project, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (we'll add security rules later)
4. Select a location close to your users
5. Click "Done"

## 3. Get Your Firebase Configuration

1. In your Firebase project, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "habit-tracker-web")
6. Copy the configuration object

## 4. Update the Firebase Configuration

Replace the placeholder values in `lib/firebase.ts` with your actual Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

## 5. Security Rules (Optional but Recommended)

In the Firestore Database section, go to "Rules" and update them to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /habits/{document} {
      allow read, write: if true; // For development only
    }
  }
}
```

**Note**: The above rules allow anyone to read/write. For production, you should implement proper authentication and security rules.

## 6. Test Your Setup

1. Start your app: `npm start`
2. Try adding a habit
3. Check your Firestore Database to see if the data appears

## Troubleshooting

- **"Firebase App named '[DEFAULT]' already exists"**: This usually means Firebase is already initialized. The current setup should handle this.
- **"Permission denied"**: Make sure your Firestore rules allow read/write operations.
- **"Network error"**: Check your internet connection and Firebase project settings.

## Next Steps

Once Firebase is working, you can:
1. Add user authentication
2. Implement proper security rules
3. Add offline support
4. Set up push notifications 