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
import Select from "react-select";
import firebase from "firebase";
import "firebase/firebase-firestore";
import app from "firebase/app";
import { useEffect } from "react";
import DateTimePicker from "react-datetime-picker";
import "firebase/firebase-storage";
import { FilePond } from "react-filepond";
import TimezoneSelect from "react-timezone-select";
import * as emailjs from "emailjs-com";

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
    backgroundColor: "lightBlue",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 5}px ${theme.spacing.unit * 2}px ${
      theme.spacing.unit * 3
    }px ${theme.spacing.unit * 3}px`,
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

function AddAssignment(props) {
  const { classes } = props;
  console.log(props.location.state);

  const [tutor, setTutor] = useState(props.location.state.data.tutor);
  const [allTutors, setAllTutors] = useState([]);
  const [student, setstudent] = useState(props.location.state.data.student);
  const [allStudents, setAllStudents] = useState([]);
  const [subject, setSubject] = useState(props.location.state.data.subject);
  const [price, setPrice] = useState(props.location.state.data.price);
  const [amount_paid, setAmountPaid] = useState(
    props.location.state.data.amount_paid
  );
  const [tutor_fee, setTutorFee] = useState(
    props.location.state.data.tutor_fee
  );
  const [due_date, setDueDate] = useState(props.location.state.due_date);
  const [comments, setComments] = useState(props.location.state.data.comments);
  const [assigned_date, setAssignedDate] = useState(
    props.location.state.assigned_date
  );
  const [payment_pending, setPaymentPending] = useState(
    props.location.state.data.payment_pending
  );
  const [satus, setStatus] = useState(props.location.state.data.satus);
  const [assURL, setAssURL] = useState("");
  const [file, setFile] = useState("");
  const [tutorId, setTutorId] = useState("");
  const [dues, setDues] = useState("");
  const [assId, setAssId] = useState("");
  const [studentCollections, setStudentCollections] = useState("");
  const [files, setFiles] = useState([]);
  const [fileAr, setFileAr] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState(
    props.location.state.data.time_zone
  );
  const [tutorEmail, setTutorEmail] = useState("");

  const changeTutorHandler = (value) => {
    setTutor(value);
    console.log({ value }, value.dues);
    setTutorId(value.id);
  };

  const changeStudentHandler = (value) => {
    setstudent(value);
    console.log({ value });
  };

  useEffect(() => {
    const db = app.firestore();
    window.scrollTo(0, 0);
    db.collection("tutors").onSnapshot((snapshot) => {
      const data = [];
      const ids = [];
      snapshot.forEach((doc) => {
        data.push({ ...doc.data() });
        ids.push(doc.id);
        // console.log(doc.id);
      });
      console.log(ids);
      let data1 = [];
      for (var i = 0; i < data.length; i++) {
        data1.push({ ...data[i], id: ids[i] });
        console.log(data[i], data1[i].dues);
        // console.log(data[i]);
      }
      data1 = data1.map((dat) => {
        return {
          value: dat.id,
          label: dat.name,
          email: dat.email,
          dues: dat.dues,
          id: dat.id,
        };
      });
      setAllTutors(data1);
      console.log(allTutors);
    });

    db.collection("students").onSnapshot((snapshot) => {
      const data = [];
      const ids = [];
      snapshot.forEach((doc) => {
        data.push({ ...doc.data() });
        ids.push(doc.id);
        // console.log(doc.id);
      });
      console.log(ids);
      let data1 = [];
      for (var i = 0; i < data.length; i++) {
        data1.push({
          name: data[i].name,
          id: ids[i],
          collections: data[i].collections,
        });
        // console.log(data[i]);
      }
      data1 = data1.map((dat) => {
        return {
          value: dat.id,
          label: dat.name,
          collections: dat.collections,
          id: dat.id,
        };
      });
      console.log(data1);
      setAllStudents(data1);
    });
  }, []);

  return (
    <div style={{ backgroundColor: "#dee4e3" }}>
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Add Assignment
          </Typography>
          <form
            className={classes.form}
            onSubmit={(e) => e.preventDefault() && false}
          >
            <FormControl margin="normal" required fullWidth>
              <p>Student</p>
              <Select
                options={allStudents}
                value={student}
                isDisabled
                defaultInputValue={student}
                onChange={changeStudentHandler}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <p>Tutor</p>
              <Select
                options={allTutors}
                isDisabled
                value={tutor}
                defaultInputValue={tutor}
                onChange={changeTutorHandler}
              />
            </FormControl>
            <p>Time zone</p>
            <div className="select-wrapper">
              <TimezoneSelect
                value={selectedTimezone}
                onChange={setSelectedTimezone}
              />
            </div>

            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="name">Subject</InputLabel>
              <Input
                id="name"
                name="name"
                autoComplete="off"
                autoFocus
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="name">Price</InputLabel>
              <Input
                id="name"
                name="name"
                autoComplete="off"
                autoFocus
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="name">Amount Paid</InputLabel>
              <Input
                id="name"
                name="name"
                autoComplete="off"
                autoFocus
                value={amount_paid}
                onChange={(e) => setAmountPaid(e.target.value)}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="name">Tutor Fee</InputLabel>
              <Input
                id="name"
                name="name"
                autoComplete="off"
                autoFocus
                value={tutor_fee}
                onChange={(e) => setTutorFee(e.target.value)}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="name">Comments</InputLabel>
              <Input
                id="name"
                name="name"
                autoComplete="off"
                autoFocus
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <p>Due Date</p>
              <DateTimePicker onChange={setDueDate} value={due_date} />
            </FormControl>
            <FilePond
              files={files}
              allowMultiple={true}
              maxFiles={15}
              onupdatefiles={setFiles}
            />
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
    </div>
  );

  async function upload(tempar, x) {
    console.log(tempar);
    let location = "files/" + x;
    firebase.storage().ref(location).constructor.prototype.putFiles = function (
      tempar
    ) {
      var ref = this;
      return Promise.all(
        tempar.map(function (file) {
          return ref.child(file.name).put(file);
        })
      );
    };

    // use it!
    let s = "files/" + x.toString();
    console.log("huehue " + s);
    firebase
      .storage()
      .ref(s)
      .putFiles(tempar)
      .then((snapshot) => {
        console.log(snapshot);
      });
  }

  async function onRegister() {
    console.log(selectedTimezone);
    const tempar = [];
    for (let i = 0; i < files.length; i++) {
      tempar.push(files[i].file);
    }

    // setFileAr(tempar)
    console.log(tempar);

    // console.log(hashPwd);

    if (
      tutor == "" ||
      student == "" ||
      subject == "" ||
      price == "" ||
      amount_paid == "" ||
      tutor_fee == "" ||
      comments == "" ||
      due_date == "" ||
      tempar == "" ||
      selectedTimezone == ""
    ) {
      alert("Please Fill All Required Field");
      return;
    }

    let x = student.label + tutor.label + assigned_date.toISOString();
    console.log("huehue       " + x);
    setAssId(x);

    upload(tempar, x);

    console.log(
      student,
      tutor.label,
      subject,
      price,
      amount_paid,
      tutor_fee,
      comments
    );
    console.log(allTutors);
    for (var i = 0; i < allTutors.length; i++) {
      if (allTutors[i].label == tutor.label) {
        setTutorId(allTutors[i].value);
        console.log(tutorId);
        break;
      }
    }

    // console.log(name, email, country.label)
    try {
      const db = app.firestore();
      try {
        await db
          .collection("assignments")
          .add({
            amount_paid: parseInt(amount_paid),
            assigned_date: assigned_date,
            comments: comments,
            due_date: due_date,
            payment_pending: payment_pending,
            price: parseInt(price),
            satus: satus,
            student: student.label,
            subject: subject,
            tutor: tutor.label,
            tutor_fee: parseInt(tutor_fee),
            ass_id: x,
            time_zone: selectedTimezone.value,
          })
          .then((doc) => {
            console.log(doc.id, due_date, price - amount_paid, student);
            console.log(
              doc.id,
              due_date,
              "pending",
              tutor.label,
              tutor_fee,
              tutorId
            );
            setAssId(doc.id);
          });

        db.collection("tutors").onSnapshot((snapshot) => {
          snapshot.forEach((doc) => {
            if (doc.data().name === tutor.label) {
              var temp = doc.data();
              temp.dues += parseInt(tutor_fee);
              setTutorId(doc.id);
              setDues(temp.dues);
            }
            // console.log(doc.id, doc.data(), tutor.value);
          });
        });
      } catch (error) {
        alert(error.message);
      }

      updateDues();
      updateDuesCollection(x);
      updatePayment(x);
      updateStudentCollection();
    } catch (error) {
      alert(error.message);
    }

    sendEmail();
    // updateTutorDues()
  }
  // updateDues();
  // updateDuesCollection();
  // updatePayment();

  function sendEmail() {
    console.log(tutor.email);
    let message =
      "You got a new assignment for student " +
      student.label +
      " subject name is " +
      subject +
      ". The due date is " +
      due_date +
      " and you will be paid " +
      tutor_fee;
    console.log(message);

    let templateParams = {
      to_name: tutor.email,
      from_name: "chitransh.326@gmail.com",
      subject: "New Assignment Assigned",
      message: message,
    };

    emailjs.send(
      "service_5x2bgwj",
      "template_mdudrfo",
      templateParams,
      "user_2Mb02sYPwYBJT9hScfbBR"
    );
  }

  async function updateDues() {
    console.log(tutor.dues);
    try {
      if (tutorId != "") {
        console.log(tutor);
        let dues = tutor.dues + parseInt(tutor_fee);
        await app.firestore().collection("tutors").doc(tutor.id).update({
          dues: dues,
        });
      }
    } catch (error) {
      alert(error.message);
    }
  }

  async function updateDuesCollection(x) {
    try {
      // console.log(dues);
      console.log({ assId });
      await app
        .firestore()
        .collection("dues")
        .add({
          assg_id: x,
          due_date: due_date,
          status: "pending",
          tutor: tutor.label,
          tutor_fee: parseInt(tutor_fee),
          tutorId: tutorId,
        });
    } catch (error) {
      alert(error.message);
    }
  }

  async function updatePayment(x) {
    try {
      console.log(student);
      await app
        .firestore()
        .collection("payment_collection")
        .add({
          assg_id: x,
          due_date: due_date,
          pending: price - amount_paid,
          status: "pending",
          student: student.label,
          id: student.id,
        });
    } catch (error) {
      alert(error.message);
    }
  }

  async function updateStudentCollection() {
    try {
      // console.log(dues);
      await app
        .firestore()
        .collection("students")
        .doc(student.value)
        .update({
          collections:
            parseInt(student.collections) + parseInt(price - amount_paid),
        });
    } catch (error) {
      alert(error.message);
    }
  }
}

export default withStyles(styles)(AddAssignment);