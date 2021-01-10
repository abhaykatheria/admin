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
  const [studentId, setStudentId] = useState('')
  const [studentDues, setStudentDues] = useState('')
  const [downloadLinks, setDownloadLinks] = useState([])
  const [studentTimezone, setStudentTimezone] = useState('')


  const map = {
    'Pacific/ Honolulu': -10,
    'America/Juneau': -9,
    'America/Tijuana': -8,
    'America/Boise': -7,
    'America/Chihuahua': -7,
    'America/Phoenix': -7,
    'America/Chicago': -6,
    'America/Regina': -6,
    'America/Mexico_City': -6,
    'America/Belize': -6,
    'America/Detroit': -5,
    'America/Bogota': -5,
    'America/Caracas': -4,
    'America/St_Johns': -3.50,
    'America/Sao_Paulo': -3,
    'America/Argentina/Buenos_Aires': -3,
    'America/Godthab': -3,
    'Atlantic/Azores': -1,
    'Atlantic/Cape_Verde': -1,
    GMT: 0,
    'Africa/Casablanca': 0,
    'Atlantic/Canary': 0,
    'Europe/Belgrade': 1,
    'Europe/Sarajevo': 1,
    'Europe/Brussels': 1,
    'Europe/Amsterdam': 1,
    'Africa/Algiers': 1,
    'Europe/Bucharest': 2,
    'Africa/Cairo': 2,
    'Europe/Helsinki': 2,
    'Europe/Athens': 2,
    'Asia/Jerusalem': 2,
    'Africa/Harare': 2,
    'Europe/Moscow': 3,
    'Asia/Kuwait': 3,
    'Africa/Nairobi': 3,
    'Asia/Baghdad': 3,
    'Asia/Tehran': 3.5,
    'Asia/Dubai': 4,
    'Asia/Baku': 4.5,
    'Asia/Kabul': 4.5,
    'Asia/Yekaterinburg': 5,
    'Asia/Karachi': 5,
    'Asia/Kolkata': 5.5,
    'Asia/Kathmandu': 5.75,
    'Asia/Dhaka': 6,
    'Asia/Colombo': 5.5,
    'Asia/Almaty': 6,
    'Asia/Rangoon': 6.5,
    'Asia/Bangkok': 7,
    'Asia/Krasnoyarsk': 7,
    'Asia/Shanghai': 8,
    'Asia/Kuala_Lumpur': 8,
    'Asia/Taipei': 8,
    'Australia/Perth': 8,
    'Asia/Irkutsk': 8,
    'Asia/Seoul': 9,
    'Asia/Tokyo': 9,
    'Asia/Yakutsk': 10,
    'Australia/Darwin': 9.5,
    'Australia/Adelaide': 10.5,
    'Australia/Sydney': 11,
    'Australia/Brisbane': 10,
    'Australia/Hobart': 11,
    'Asia/Vladivostok': 10,
    'Pacific/Guam': 10,
    'Asia/Magadan': 11,
    'Pacific/Fiji': 13,
    'Pacific/Auckland': 13,
    'Pacific/Tongatapu': 14,
  }




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
    console.log(tutor)
    if (props.location.state.data.price > 0 || props.location.state.data.amount_paid)
      setColFlag(false)

    if (props.location.state.data.tutor_fee)
      setDuesFlag(false)

    setDuesFlag(true)

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
      // console.log(ids);
      let data1 = [];
      for (var i = 0; i < data.length; i++) {
        data1.push({ ...data[i], id: ids[i] });
        // console.log(data[i], data1[i].dues);
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
          setStudentTimezone(doc.data().time_zone)
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
              <p>Due Date</p>
              <p>{props.location.state.due_date}</p>
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

  function checkValid(x) {
    if (isNaN(parseInt(x)) || parseInt(x) == 0)
      return false
    return true
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


  async function onRegister() {

    console.log(typeof due_date, due_date)
    if (due_date === undefined || due_date == '' || due_date === null) {
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
      comments,
      studentTimezone
    );
    console.log(allTutors);
    for (var i = 0; i < allTutors.length; i++) {
      if (allTutors[i].label == tutor.label) {
        setTutorId(allTutors[i].value);
        console.log(tutorId);
        break;
      }
    }

    let offset = 5.5 - map[studentTimezone]
    offset *= 60
    let dt = due_date
    if(offset!==0)
    dt.setMinutes(dt.getMinutes() + offset)
    setDueDate(dt)
    console.log(offset,due_date)

    try {


      const db = app.firestore();
      try {

        if (due_date === undefined) {
          await db
            .collection("assignments").doc(docId)
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
              tutor_fee: parseInt(tutor_fee),
              ass_id: x,
              // time_zone: selectedTimezone.value,
            })
            .then((doc) => {
              alert("Assignment updated successfully")
            });
        }
        else {
          await db
            .collection("assignments").doc(docId)
            .update({
              amount_paid: parseInt(amount_paid),
              // assigned_date: props.location.state.data.assigned_date,
              comments: comments,
              due_date: due_date,
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
        console.log(due_date)
        // updateDues();
        // updateDuesCollection(x);
      }
      console.log('huehue')

      if (colFlag && checkValid(amount_paid) && checkValid(price)) {
        console.log('huehue')
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
      s += " ............ "
    }

    console.log(s)


    console.log(tutorEmail)
    let message = "You have been assigned a new lesson as a Tutor. Here are the additional details-" + "\n"
      + "Due Status:       " + due_date + "\n"
      + "Student Name:     " + student.label + "\n"
      + "Type:             " + "General" + "\n"
      + "Subject:          " + subject + "\n"
      + "Comments:         " + comments + "\n"
      + "The download links are:- " + "\n\n\n"
      + s

    console.log(message)

    message = ""

    let templateParams = {
      to_name: tutorEmail,
      from_name: 'chitransh.326@gmail.com',
      subject: "Assignment Modified",
      message: message,
      student: student,
      due_date: new Date(props.location.state.data.due_date.seconds * 1000).toLocaleString(),
      type: 'general',
      ass: subject,
      comments: comments,
      links: s
    }

    if (s != '') {
      emailjs.send(
        'service_gkjzrw9',
        'template_n3ql3z5',
        templateParams,
        'user_qXHvjLnbOETurGAvHuFye'
      )
      alert('Email sent successfully')
    }
  }

  async function updateDues() {
    try {
      if (tutorId != "") {

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
      await app
        .firestore()
        .collection("dues")
        .add({
          assg_id: x,
          due_date: due_date,
          status: "pending",
          tutor: tutor,
          tutor_fee: parseInt(tutor_fee),
          tutorId: tutorId,
          student: student,
          assigned_date: assigned_date,
          subject: subject
        });
    } catch (error) {
      alert(error.message);
    }
  }

  async function updatePayment(x) {
    try {

      console.log(x, due_date,);
      await app
        .firestore()
        .collection("payment_collection")
        .add({
          assg_id: x,
          due_date: due_date,
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
      console.log(studentId, studentCollections);
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
