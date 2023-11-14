
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'
import {getStorage} from 'firebase/storage'


const firebaseConfig = {
  apiKey: "AIzaSyDkccVR65UnUrLMPk7nR0IaUJTFDWEAxkE",
  authDomain: "tryout-8be09.firebaseapp.com",
  databaseURL: "https://tryout-8be09-default-rtdb.firebaseio.com",
  projectId: "tryout-8be09",
  storageBucket: "tryout-8be09.appspot.com",
  messagingSenderId: "226190036300",
  appId: "1:226190036300:web:90d02a73ebec0b527f53e9",
  measurementId: "G-12BB3VL7WB"
};

const app = initializeApp(firebaseConfig)

const auth = getAuth()
const firebase = getFirestore(app)
const storage = getStorage(app)

export { auth, firebase, storage }