// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';




  const firebaseConfig = {
    apiKey: "AIzaSyA_1ncE7qDEhj5yH7NQzl6M8Tw2nCOwU5E",
    authDomain: "chatflow-c.firebaseapp.com",
    projectId: "chatflow-c",
    storageBucket: "chatflow-c.appspot.com",
    messagingSenderId: "91815708096",
    appId: "1:91815708096:web:05f9590691f84891bdb425"
  };

  
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app)

export { auth, firestore ,storage};
