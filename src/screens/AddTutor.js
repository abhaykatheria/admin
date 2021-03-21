import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Avatar,
  Button,
  FormControl,
  Input,
  InputLabel,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import withStyles from "@material-ui/core/styles/withStyles";
import Select from "react-select";
import countryList from "react-select-country-list";
import "firebase/firebase-firestore";
import app from "firebase/app";

const styles = (theme) => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${
      theme.spacing.unit * 3
    }px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

function AddTutor(props) {
  const { classes } = props;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  });


  return (
    <main className={classes.main}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Add Tutor
        </Typography>
        <form
          className={classes.form}
          onSubmit={(e) => e.preventDefault() && false}
        >
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="name">Name</InputLabel>
            <Input
              id="name"
              name="name"
              autoComplete="off"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email">Email Address</InputLabel>
            <Input
              id="email"
              name="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="phoneNumber">Phone number</InputLabel>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              autoComplete="off"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={onRegister}
            // component={Link}
            // to="/register"
            className={classes.submit}
          >
            Register
          </Button>
        </form>
      </Paper>
    </main>
  );

  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  async function onRegister() {
    if (name=== "" ||email==="" || phoneNumber === "" ) {
      alert("Please Fill All Required Field");
      return;
    }

    if(!validateEmail(email)){
      alert("Please enter a valid email")
      return
    }

    console.log(name, email);
    try {
      const db = app.firestore();
      db.collection("tutors").add({
        name: name,
        email: email,
        dues: 0,
        phoneNumber: phoneNumber
      }).then(function (id) {
        console.log(id.id)
        if(id.id!=''){
        alert('Tutor added succesfully')
          setName('')
          setEmail('')
          setPhoneNumber('')
      }
        else
        alert('Some error occured, try again')
      });

    } catch (error) {
      alert('Some error occured, try again')
      // alert(error.message);
    }
  }
}

export default withStyles(styles)(AddTutor);
