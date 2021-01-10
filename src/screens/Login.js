import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import firebase from "firebase";

function Login() {
  const onClickHandler = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        console.log(error);
        // ...
      });
  };
  return (
    <div style={{ textAlign: "center" }}>
      <Button
        style={{ position: "absolute", top: "50%" }}
        color="primary"
        variant="contained"
        onClick={onClickHandler}
      >
        Login
      </Button>
    </div>
  );
}

export default Login;
