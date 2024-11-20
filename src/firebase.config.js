// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyALzM0qnVTIw3gx5h6uv_P4fr4LB9bdl50",
  authDomain: "twitsnap-d3c22.firebaseapp.com",
  projectId: "twitsnap-d3c22",
  storageBucket: "twitsnap-d3c22.appspot.com",
  messagingSenderId: "856906798335",
  appId: "1:856906798335:android:9b6be3edd94e8d895be8ca",
  databaseURL: "https://twitsnap-d3c22-default-rtdb.firebaseio.com/",
};

// Inicializa Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Exporta Firestore
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { firestore, storage };
