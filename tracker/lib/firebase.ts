import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { config } from './config';

// Validate required Firebase configuration
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingFields = requiredFields.filter(field => !config.firebase[field as keyof typeof config.firebase]);

if (missingFields.length > 0) {
  console.error('Missing Firebase configuration:', missingFields);
  console.error('Please check your .env file and ensure all Firebase variables are set.');
}

// Your Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
  projectId: config.firebase.projectId,
  storageBucket: config.firebase.storageBucket,
  messagingSenderId: config.firebase.messagingSenderId,
  appId: config.firebase.appId,
  measurementId: config.firebase.measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Test Firebase connection
console.log('Firebase initialized with project:', config.firebase.projectId);

// Test Firestore connectivity
export const testFirestoreConnection = async () => {
  try {
    console.log('Testing Firestore connection...');
    const { collection, getDocs } = await import('firebase/firestore');
    const testCollection = collection(db, 'test');
    await getDocs(testCollection);
    console.log('✅ Firestore connection successful!');
    return true;
  } catch (error: any) {
    console.error('❌ Firestore connection failed:', error?.message);
    console.error('This usually means Firestore Database is not enabled in your Firebase project.');
    console.error('Please follow the FIRESTORE_SETUP.md guide to enable Firestore.');
    return false;
  }
};

export default app; 