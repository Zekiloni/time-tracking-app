import {initializeApp} from "firebase/app";
import {getAuth, GoogleAuthProvider } from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getAnalytics} from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBvceNU2nXC1PwSz04xr2TT50ajvB0hQUs",
    authDomain: "time-tracking-app-90ee9.firebaseapp.com",
    projectId: "time-tracking-app-90ee9",
    storageBucket: "time-tracking-app-90ee9.firebasestorage.app",
    messagingSenderId: "935163854261",
    appId: "1:935163854261:web:a1679b16bca4ce71242dfc",
    measurementId: "G-XCZDF3441Q"
};

const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);