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
import moment from "moment";
import DurationPicker from 'react-duration-picker'


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
    padding: `${theme.spacing.unit * 5}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 3
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
  // console.log(props.location.state);

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
  const [due_date, setDueDate] = useState('');
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
  const [assId, setAssId] = useState(props.location.state.data.ass_id);
  const [studentCollections, setStudentCollections] = useState("");
  const [files, setFiles] = useState([]);
  const [fileAr, setFileAr] = useState([]);
  const [docId, setDocId] = useState(props.location.state.data.id)
  const [duesFlag, setDuesFlag] = useState(true)
  const [colFlag, setColFlag] = useState(true)
  const [startDate, setStartDate] = useState('')
  const [duration, setDuration] = useState(props.location.state.data.duration)
  const [studentId, setStudentId] = useState('')
  const [downloadLinks, setDownloadLinks] = useState([])

  // console.log(props.location.state, duration)

  // const [selectedTimezone, setSelectedTimezone] = useState(
  //   props.location.state.data.time_zone
  // );
  const [tutorEmail, setTutorEmail] = useState(props.location.state.data.tutor_email);

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
    console.log(duration)
    console.log(startDate)
    if (props.location.state.data.price > 0 || props.location.state.data.amount_paid)
      setColFlag(false)

    if (props.location.state.data.tutor_fee)
      setDuesFlag(false)

    console.log(assId, docId)
    const db = app.firestore();
    window.scrollTo(0, 0);
    db.collection("tutors").onSnapshot((snapshot) => {
      const data = [];
      const ids = [];
      snapshot.forEach((doc) => {
        if (doc.data().name == tutor) {
          setTutorId(doc.id)
          setDues(doc.data().dues)
        }
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
        if (doc.data().name == student) {
          setStudentId(doc.id);
          setStudentCollections(doc.data().collections)
        }
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
            Modify Assignment
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
            {/* <p>Time zone</p>
            <div className="select-wrapper">
              <TimezoneSelect
                value={selectedTimezone}
                onChange={setSelectedTimezone}
              />
            </div> */}

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
              {colFlag && <Input
                id="name"
                name="name"
                autoComplete="off"
                autoFocus
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              }
              {!colFlag && <Input
                id="name"
                name="name"
                autoComplete="off"
                autoFocus
                disabled
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              }
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="name">Amount Paid</InputLabel>
              {colFlag &&
                <Input
                  id="name"
                  name="name"
                  autoComplete="off"
                  autoFocus
                  value={amount_paid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                />
              }
              {!colFlag &&
                <Input
                  id="name"
                  name="name"
                  autoComplete="off"
                  disabled
                  autoFocus
                  value={amount_paid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                />
              }
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="name">Tutor Fee</InputLabel>
              {duesFlag &&
                <Input
                  id="name"
                  name="name"
                  autoComplete="off"
                  autoFocus
                  value={tutor_fee}
                  onChange={(e) => setTutorFee(e.target.value)}
                />
              }
              {!duesFlag &&
                <Input
                  id="name"
                  name="name"
                  autoComplete="off"
                  autoFocus
                  disabled
                  value={tutor_fee}
                  onChange={(e) => setTutorFee(e.target.value)}
                />
              }
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
              <p>Start Date</p>
              <p>{props.location.state.due_date}</p>
              <DateTimePicker onChange={setStartDate} value={startDate} />
            </FormControl>

            <DurationPicker
              onChange={(duration) => {

                // console.log(hours,minutes,seconds)

                setDuration(duration)
              }
              }
              initialDuration={props.location.state.data.duration}
              maxHours={24}
            />

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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => {
                let x = assId
                let s = getDownloadLinks(x)
              }}
              // component={Link}
              // to="/register"
              className={classes.submit}>
              Send email
          			</Button>
          </form>
        </Paper>
      </main>
    </div>
  );

  async function getDownloadLinks(x) {
    let location =
      "/files/" + x.toString();
    var temp = [];
    var storageRef = app.storage().ref(location);
    // console.log(storageRef)
    await storageRef
      .listAll()
      .then(function (result) {
        result.items.forEach(function (imageRef) {
          // console.log(imageRef)
          imageRef
            .getDownloadURL()
            .then(function (url) {
              temp.push(url.toString());
              console.log(temp)
              // console.log(ar)
            })
            .catch(function (error) {
              // Handle any errors
            });
        });
      })
      .catch(function (error) {
        // Handle any errors
      });
    if (temp != [])
      setDownloadLinks(temp)
    let s = ""
    for (let [key, value] of Object.entries(downloadLinks)) {
      let url = value;
      console.log(url);
      s += url
      s += "\n"
    }

    if (s != "") {
      console.log(s)
      sendEmail()
    }

    return s

  }


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

  function checkValid(x) {
    if (isNaN(parseInt(x)) || parseInt(x) == 0)
      return false
    return true
  }

  async function onRegister() {

    if (startDate === undefined || startDate == '' || startDate === null) {
      alert('Fill due date and if its same as previous fill it again')
      return
    }

    console.log(duesFlag, colFlag)
    // console.log(selectedTimezone);
    const tempar = [];
    for (let i = 0; i < files.length; i++) {
      tempar.push(files[i].file);
    }

    // setFileAr(tempar)
    console.log(tempar);

    // console.log(hashPwd);

    if (
      tutor == "" ||
      student == ""
      // selectedTimezone == ""
    ) {
      alert("Please Fill All Required Field");
      return;
    }

    let x = assId;
    console.log("huehue       " + x);
    setAssId(x);

    upload(tempar, x);

    console.log(
      student,
      tutor,
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
        console.log(docId, amount_paid, comments, payment_pending, price, student, subject, tutor, duration, comments)
        if (startDate === undefined) {
          console.log('huehue')

        }

        setDueDate(startDate)

        if (startDate === undefined || startDate === '') {
          await db
            .collection("timed").doc(docId)
            .update({
              amount_paid: parseInt(amount_paid),
              // assigned_date: props.location.state.data.assigned_date,
              comments: comments,
              payment_pending: payment_pending,
              price: parseInt(price),
              satus: satus,
              student: student,
              subject: subject,
              tutor: tutor,
              duration: duration,
              tutor_fee: parseInt(tutor_fee),
              ass_id: x,
              start_date: props.location.state.data.start_date,
              // time_zone: selectedTimezone.value,
            })
            .then((doc) => {
              alert("Assignment updated successfully")
            });
        }
        else {
          await db
            .collection("timed").doc(docId)
            .update({
              amount_paid: parseInt(amount_paid),
              // assigned_date: props.location.state.data.assigned_date,
              comments: comments,
              start_date: startDate,
              duration: duration,
              payment_pending: payment_pending,
              price: parseInt(price),
              satus: satus,
              student: student,
              subject: subject,
              tutor: tutor,
              tutor_fee: parseInt(tutor_fee),
              ass_id: x,
              // time_zone: selectedTimezone.value,
            })
            .then((doc) => {
              alert("Assignment updated successfully")
            });
        }



      } catch (error) {
        alert(error.message);
      }

      if (duesFlag && checkValid(tutor_fee)) {
        updateDues();
        updateDuesCollection(x);
      }
      if (colFlag && checkValid(amount_paid) && checkValid(price)) {
        updatePayment(x);
        updateStudentCollection();
      }
    } catch (error) {
      alert(error.message);
    }

    // sendEmail();
    // updateTutorDues()
  }
  // updateDues();
  // updateDuesCollection();
  // updatePayment();

  function sendEmail() {
    let s = ""
    for (let [key, value] of Object.entries(downloadLinks)) {
      let url = value;
      console.log(url);
      s += url
      s += "                             "
    }

    console.log(s)


    console.log(tutorEmail)
    let message = "You have been assigned a new lesson as a Tutor. Here are the additional details-" + "\n"
      + "Due Status:       " + startDate + "\n"
      + "Student Name:     " + student + "\n"
      + "Type:             " + "General" + "\n"
      + "Subject:          " + subject + "\n"
      + "Comments:         " + comments + "\n"
      + "The download links are:- " + "\n\n\n"
      + s

    console.log(message, tutorEmail, props.location.state.data)

    let templateParams = {
      to_name: tutorEmail,
      from_name: 'chitransh.326@gmail.com',
      subject: "New Assignment Assigned",
      message: message,
    }

    if (s != '') {
      emailjs.send(
        'service_5x2bgwj',
        'template_mdudrfo',
        templateParams,
        'user_2Mb02sYPwYBJT9hScfbBR'
      )
      alert('Email sent successfully')
    }
  }


  async function updateDues() {
    try {
      if (tutorId != "") {
        console.log(tutor);
        setDues(dues + parseInt(tutor_fee))
        await app.firestore().collection("tutors").doc(tutorId).update({
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
          due_date: startDate,
          status: "pending",
          tutor: tutor,
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
          due_date: startDate,
          pending: price - amount_paid,
          status: "pending",
          student: student,
          id: studentId,
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
        .doc(studentId)
        .update({
          collections:
            parseInt(studentCollections) + parseInt(price - amount_paid),
        });
    } catch (error) {
      alert(error.message);
    }
  }
}

export default withStyles(styles)(AddAssignment);
