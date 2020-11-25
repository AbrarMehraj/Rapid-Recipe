/** @format */

import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyCD-RHD_zZgboXg4K8huJUy7aJ8hkQPFPE',
  authDomain: 'rapid-13334.firebaseapp.com',
  databaseURL: 'https://rapid-13334.firebaseio.com',
  projectId: 'rapid-13334',
  storageBucket: 'rapid-13334.appspot.com',
  messagingSenderId: '328700865814',
  appId: '1:328700865814:web:10cb479f14842d029c7437',
  measurementId: 'G-16XDFQJRTC',
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
