# Environment Variables Setup

## Why Environment Variables?

Environment variables help keep sensitive information like API keys secure and out of your codebase. This is especially important when sharing code or deploying to production.

## Setup Instructions

### 1. Create Environment File

Create a `.env` file in your project root with your Firebase configuration:

```bash
# Copy your Firebase config from lib/firebase.ts
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyAua3qLcO_89QWxcFB1fWhtZfW2IxKHdDg
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=habit-tracker-b252a.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=habit-tracker-b252a
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=habit-tracker-b252a.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1098342687979
EXPO_PUBLIC_FIREBASE_APP_ID=1:1098342687979:web:46345627614363a0b84aae
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-3W8PS7X12K
```

### 2. Restart Your Development Server

After creating the `.env` file, restart your Expo development server:

```bash
npm start
```

### 3. Verify Configuration

The app should now load your Firebase configuration from environment variables instead of hardcoded values.

## Security Benefits

- ✅ **No API keys in code**: Sensitive data stays out of version control
- ✅ **Easy deployment**: Different environments can use different configs
- ✅ **Team collaboration**: Each developer can have their own Firebase project
- ✅ **Production safety**: Reduces risk of accidentally exposing credentials

## Important Notes

- **Never commit `.env` files**: They're already added to `.gitignore`
- **Use `EXPO_PUBLIC_` prefix**: This makes variables available in the client-side code
- **Restart required**: Environment changes require a server restart
- **Backup your config**: Keep a safe copy of your Firebase configuration

## Troubleshooting

### Environment variables not loading?

1. Make sure the `.env` file is in the project root
2. Restart the development server
3. Check that variable names start with `EXPO_PUBLIC_`
4. Verify the `.env` file has no spaces around the `=` sign

### Firebase connection issues?

1. Double-check your Firebase configuration values
2. Ensure your Firebase project is properly set up
3. Check that Firestore is enabled in your Firebase console

## Next Steps

Once environment variables are working:

1. **Remove hardcoded values**: Delete the old Firebase config from `lib/firebase.ts`
2. **Set up different environments**: Create `.env.development` and `.env.production`
3. **Add CI/CD variables**: Set up environment variables in your deployment pipeline 