// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDg2jNM33Kh2jMIRJZfE1rwYUBuMCHouuE",
    authDomain: "inventory-management-app-cd985.firebaseapp.com",
    projectId: "inventory-management-app-cd985",
    storageBucket: "inventory-management-app-cd985.appspot.com",
    messagingSenderId: "329913069486",
    appId: "1:329913069486:web:75d17a8673b15d4f02223f",
    measurementId: "G-3STZEWSNQS"
};

// Initialize Firebase                    
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };