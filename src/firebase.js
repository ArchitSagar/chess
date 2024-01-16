// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';

// const config = {
//   apiKey: "AIzaSyCjE8o7nLIh9cdxmPcDOI2KD0-ZNZBDgw0",
//   authDomain: "react-chess-52a06.firebaseapp.com",
//   projectId: "react-chess-52a06",
//   storageBucket: "react-chess-52a06.appspot.com",
//   messagingSenderId: "929699770888",
//   appId: "1:929699770888:web:bb4431a1033121d41d57bd"
// };

// const firebaseApp = initializeApp(config);

// export const db = getFirestore(firebaseApp);
// export const auth = getAuth(firebaseApp);

// export default firebaseApp;

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const config = {
    apiKey: "AIzaSyCjE8o7nLIh9cdxmPcDOI2KD0-ZNZBDgw0",
    authDomain: "react-chess-52a06.firebaseapp.com",
    projectId: "react-chess-52a06",
    storageBucket: "react-chess-52a06.appspot.com",
    messagingSenderId: "929699770888",
    appId: "1:929699770888:web:bb4431a1033121d41d57bd"
};

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

export const db = firebase.firestore();
export const auth = firebase.auth();
export default firebase;