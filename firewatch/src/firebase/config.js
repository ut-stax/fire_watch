import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBSX7fGkck6lSv_QqmPafQKaDNsnMGWVVE',
  authDomain: 'fire-watch-f63e1.firebaseapp.com',
  projectId: 'fire-watch-f63e1',
  storageBucket: 'fire-watch-f63e1.firebasestorage.app',
  messagingSenderId: '459518421583',
  appId: '1:459518421583:web:91bd039f5598a438ccd83a',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;