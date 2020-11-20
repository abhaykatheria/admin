import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from "firebase";

firebase.initializeApp({
  apiKey: "AIzaSyB7a7wdQKU26qpVIeIfK54fG6Td1M4S_g8",
  authDomain: "admin-df1ba.firebaseapp.com",
  databaseURL: "https://admin-df1ba.firebaseio.com",
  projectId: "admin-df1ba",
  storageBucket: "admin-df1ba.appspot.com",
  messagingSenderId: "740584738619",
  appId: "1:740584738619:web:3005b4dd5df2f3235d311e",
  measurementId: "G-7TY7EN6QSR"
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
