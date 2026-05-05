import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAq4B5bAXgC39nFTZh9ZmJw-Bpz3ceYUlg",
  authDomain: "voting-poll-app-e5b67.firebaseapp.com",
  projectId: "voting-poll-app-e5b67",
  storageBucket: "voting-poll-app-e5b67.firebasestorage.app",
  messagingSenderId: "393424187903",
  appId: "1:393424187903:web:5d44709bf8c542386f77ca",
  measurementId: "G-HQBXHYG66B",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
