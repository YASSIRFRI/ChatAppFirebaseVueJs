// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';




const firebaseConfig = {
  apiKey: "AIzaSyCCyP-G6yPX1JxVFLxHjO0z5_rVTITFzVI",
  authDomain: "cschatapp-fd89c.firebaseapp.com",
  projectId: "cschatapp-fd89c",
  storageBucket: "cschatapp-fd89c.appspot.com",
  messagingSenderId: "1003868956693",
  appId: "1:1003868956693:web:65a04171eb02f425a6c61c",
  measurementId: "G-HHQCMXL7DH"
};

  
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app)

export { auth, firestore ,storage};
