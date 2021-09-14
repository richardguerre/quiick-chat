import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";
import "firebase/database";
import "firebase/analytics";

const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG || "Add REACT_APP_FIREBASE_CONFIG in .env");

firebase.initializeApp(firebaseConfig);

firebase.analytics();
