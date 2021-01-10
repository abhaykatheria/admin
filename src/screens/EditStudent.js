import React, { useState } from "react";
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
import "firebase/firebase-firestore";
import app from "firebase/app";
import TimezoneSelect from "react-timezone-select";
import { useEffect } from "react";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'


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

function EditStudent(props) {
  const { classes } = props;
  console.log(props.location.state);

  const [name, setName] = useState(props.location.state.data.name);
  const [email, setEmail] = useState(props.location.state.data.email);
  const [docId,setDocId] = useState(props.location.state.data.id);
  const [collections, setCollections] = useState(props.location.state.data.collections);
  const [comment, setComment] = useState(props.location.state.data.comment)
  const [value, setValue] = useState(props.location.state.data.phone_number)

  const [time_zone, setTime_Zone] = useState(
    props.location.state.data.time_zone
  );
  const [selectedTimezone, setSelectedTimezone] = useState(
    props.location.state.data.time_zone
  );
  
  console.log(docId,collections)

  const [allStudents, setAllStudents] = useState([]);

  useEffect(() => {
    const db = app.firestore();
    window.scrollTo(0, 0);

    db.collection("students").onSnapshot((snapshot) => {
      const data = [];
      const ids = [];
      snapshot.forEach((doc) => {
        data.push({ ...doc.data() });
      });
      let data1 = [];
      for (var i = 0; i < data.length; i++) {
        data1.push(data[i].name);
        // console.log(data[i]);
      }
      console.log(data1);
      setAllStudents(data1);
    });
  }, []);

  return (
    <main className={classes.main}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Edit Student
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
          <p>Time zone</p>
          <div className="select-wrapper">
            <TimezoneSelect
              value={selectedTimezone}
              onChange={setSelectedTimezone}
            />
          </div>
          <FormControl margin="normal" fullWidth>
            <InputLabel htmlFor="comment">Comments</InputLabel>
            <Input id="comment" name="comment" autoComplete="off" autoFocus value={comment} onChange={e => setComment(e.target.value)} />
          </FormControl>
          <PhoneInput
            placeholder="Enter phone number"
            value={value}
            onChange={setValue} />
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
    if (name == "" || selectedTimezone == "" || selectedTimezone == {}) {
      return;
    }

    if (email != "") {
      if (!validateEmail(email)) {
        alert("Please enter a valid email");
        return;
      }
    }

    if (allStudents.includes(name) && props.location.state.data.name!=name) {
      alert("You have entered a duplicate name, Please try again");
      //test comment
      return;
    }

    console.log(name, email, time_zone);
    try {
      const db = app.firestore();
      db.collection("students").doc(docId).set({
        name: name,
        email: email,
        collections: collections,
        time_zone: selectedTimezone.value,
        phone_number: value,
        comment: comment,
      }).then(function () {
        alert('Details modified successfully')
      });
    } catch (error) {
      alert("Some error occured, try again");
    }
  }
}


export default withStyles(styles)(EditStudent);
