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


  // apiKey: "AIzaSyCNc7cWXQAOYXZjT416v3SzE3rWz3DnNsw",
  //   authDomain: "admindummy-dd12c.firebaseapp.com",
  //   projectId: "admindummy-dd12c",
  //   storageBucket: "admindummy-dd12c.appspot.com",
  //   messagingSenderId: "820066517389",
  //   appId: "1:820066517389:web:7023cabd3de10426b47dc4",
  //   measurementId: "G-66TSFXLKT5"
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
