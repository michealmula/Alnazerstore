import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCDVKRd0aKt5jFHsGvLDpqQ3yI2_J_dITk",
  authDomain: "alnazerstore.firebaseapp.com",
  projectId: "alnazerstore",
  storageBucket: "alnazerstore.firebasestorage.app",
  messagingSenderId: "107484187514",
  appId: "1:107484187514:web:6c5e272d04f74f6b00a4c3"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);