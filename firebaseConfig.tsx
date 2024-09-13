// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKbj-SqoHo3GtdLnzGyI-DiRcEODRVZF4",
  authDomain: "rooms1boom.firebaseapp.com",
  projectId: "rooms1boom",
  storageBucket: "rooms1boom.appspot.com",
  messagingSenderId: "470200279097",
  appId: "1:470200279097:web:1085cf1459fa9ca3a62de8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
