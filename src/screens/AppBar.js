import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import AssignmentRoundedIcon from "@material-ui/icons/AssignmentRounded";
import EmailRoundedIcon from "@material-ui/icons/EmailRounded";
import AccessAlarmIcon from "@material-ui/icons/AccessAlarm";
import AddAlarmRoundedIcon from "@material-ui/icons/AddAlarmRounded";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import Badge from "@material-ui/core/Badge";
import { green, grey, red } from "@material-ui/core/colors";
import Tooltip from "@material-ui/core/Tooltip";
import { useState } from "react";
import app from "firebase/app";
import moment from "moment";
import "firebase/firebase-firestore";
import * as emailjs from "emailjs-com";
import firebase from "firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  green: {
    color: "#fff",
    backgroundColor: green[500],
  },
  grey: {
    color: "#fff",
    backgroundColor: grey[500],
  },
  red: {
    color: "#fff",
    backgroundColor: red[500],
  },
}));

export default function APPBar() {
  const classes = useStyles();
  const [timedAssignment, setTimedAssignment] = useState();
  const [dueToday, setDueToday] = useState();
  const [duePast, setDuePast] = useState();
  const [downloadLinks, setDownloadLinks] = useState([]);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const db = app.firestore();
    var dbRef = firebase.firestore().collection("/assignments");
    var dbTimedRef = firebase.firestore().collection("/timed");
    // console.log(new Date().toString());
    const data1 = [];
    db.collection("timed").onSnapshot((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));
      // console.log(data);
      var total = 0;
      for (var i = 0; i < data.length; i++) {
        data1.push({ ...data });
        var date = moment(data[i].due_date.toDate().toDateString()).format(
          "DD/MM/YYYY"
        );
        if (
          data[i].satus === "ongoing" &&
          date === moment().format("DD/MM/YYYY")
        ) {
          total++;
          // console.log(date," check ",moment().format("DD/MM/YYYY"))
        } else if (
          data[i].satus === "ongoing" &&
          date < moment().format("DD/MM/YYYY")
        ) {
          dbTimedRef.doc(data[i].id).update({
            satus: "completed",
          });
        }
      }
      setTimedAssignment(total);
    });
    db.collection("assignments").onSnapshot((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));
      // snapshot.forEach((doc) => console.log(doc.update({satus:"due"})));
      var today = 0;
      var past = 0;
      data1.push({ ...data });
      for (var i = 0; i < data.length; i++) {
        var date = moment(data[i].due_date.toDate().toDateString()).format(
          "DD/MM/YYYY"
        );
        if (
          data[i].satus === "ongoing" &&
          date === moment().format("DD/MM/YYYY")
        ) {
          today++;
        } else if (
          (data[i].satus === "ongoing" &&
            date < moment().format("DD/MM/YYYY")) ||
          data[i].satus === "late"
        ) {
          dbRef.doc(data[i].id).update({
            satus: "late",
          });
          past++;
        }
      }
      setDueToday(today);
      setDuePast(past);
      // console.log(data1);
    });
  }, []);

  const onLogOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        // An error happened.
      });
  };

  function getDownloadLinks(x) {
    let location = "/files/" + x.toString();
    console.log(location);
    var temp = [];
    var storageRef = app.storage().ref(location);
    // console.log(storageRef)
    storageRef
      .listAll()
      .then(function (result) {
        result.items.forEach(function (imageRef) {
          // console.log(imageRef)
          imageRef
            .getDownloadURL()
            .then(function (url) {
              temp.push(url.toString());
              // console.log(url)
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
    if (temp != []) setDownloadLinks(temp);
    let s = "";
    for (let [key, value] of Object.entries(downloadLinks)) {
      let url = value;
      // console.log(url);
      s += url;
      s += "\n";
    }
    if (s != "") console.log(s);
    if (s != "") return s;
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            component={Link}
            to={"/"}
          >
            <HomeRoundedIcon />
          </IconButton>
          <Tooltip title="Add Student" arrow>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              component={Link}
              to={"/addStudent"}
            >
              <PersonAddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add Assignment">
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              component={Link}
              to={"/addAss"}
            >
              <AssignmentRoundedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add Timed Assignment">
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              component={Link}
              to={"/addTimeAss"}
            >
              <AddAlarmRoundedIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" className={classes.title}>
            <Tooltip title="Show All Assignments" arrow>
              <Button color="inherit" component={Link} to="/allAss">
                All
              </Button>
            </Tooltip>
            <Tooltip title="Show Timed Assignments" arrow>
              <Button color="inherit" component={Link} to="/timedAss">
                Timed
              </Button>
            </Tooltip>
          </Typography>
          <IconButton aria-label="Total Assignment" color="inherit">
            <Tooltip title="Send Email to All Tutors" arrow>
              <EmailRoundedIcon
                onClick={() => {
                  const db = app.firestore();

                  db.collection("assignments")
                    .where("satus", "==", "ongoing")
                    .onSnapshot((snapshot) => {
                      snapshot.forEach((doc) => {
                        console.log(doc.data(), doc.id);
                        let s = getDownloadLinks(doc.data().ass_id);
                        if (s != undefined) {
                          console.log(s);

                          let assignment = doc.data();

                          let message =
                            "You have been assigned a new lesson as a Tutor. Here are the additional details-" +
                            "\n" +
                            "Due Status:       " +
                            assignment.due_date +
                            "\n" +
                            "Student Name:     " +
                            assignment.student +
                            "\n" +
                            "Type:             " +
                            "General" +
                            "\n" +
                            "Subject:          " +
                            assignment.subject +
                            "\n" +
                            "Comments:         " +
                            assignment.comments +
                            "\n" +
                            "The download links are:- " +
                            "\n\n\n" +
                            s;

                          message = "";

                          let templateParams = {
                            to_name: assignment.tutor_email,
                            from_name: "chitransh.326@gmail.com",
                            subject: "Assignment Update",
                            message: message,
                            student: assignment.student,
                            due_date: new Date(
                              assignment.due_date.seconds * 1000
                            ).toLocaleString(),
                            type: "general",
                            ass: assignment.subject,
                            comments: assignment.comments,
                            links: s,
                          };

                          emailjs.send(
                            "service_ftarsbj",
                            "template_iff5usj",
                            templateParams,
                            "user_spTrG7WdWYtv6Uu9jVWlf"
                          );
                        }
                      });
                    });

                  db.collection("timed")
                    .where("satus", "==", "ongoing")
                    .onSnapshot((snapshot) => {
                      snapshot.forEach((doc) => {
                        console.log(doc.data(), doc.id);
                        let s = getDownloadLinks(doc.data().ass_id);
                        if (s != undefined) {
                          console.log(s);

                          let assignment = doc.data();

                          let message =
                            "You have been assigned a new lesson as a Tutor. Here are the additional details-" +
                            "\n" +
                            "Due Status:       " +
                            assignment.due_date +
                            "\n" +
                            "Student Name:     " +
                            assignment.student +
                            "\n" +
                            "Type:             " +
                            "General" +
                            "\n" +
                            "Subject:          " +
                            assignment.subject +
                            "\n" +
                            "Comments:         " +
                            assignment.comments +
                            "\n" +
                            "The download links are:- " +
                            "\n\n\n" +
                            s;

                          message = "duration : " + assignment.duration + " minutes "

                          let templateParams = {
                            to_name: assignment.tutor_email,
                            from_name: "chitransh.326@gmail.com",
                            subject: "Assignment Update",
                            message: message,
                            student: assignment.student,
                            due_date: new Date(
                              assignment.due_date.seconds * 1000
                            ).toLocaleString(),
                            type: "timed",
                            ass: assignment.subject,
                            comments: assignment.comments,
                            links: s,
                          };

                          emailjs.send(
                            "service_ftarsbj",
                            "template_iff5usj",
                            templateParams,
                            "user_spTrG7WdWYtv6Uu9jVWlf"
                          );
                        }
                        setFlag(true);
                      });
                    });

                  if (flag) alert("Emails sent successfully");
                }}
              />
            </Tooltip>
          </IconButton>
          <IconButton aria-label="Total Assignment" color="inherit">
            <Tooltip title="Timed Assignment" arrow>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                component={Link}
                to={"/dueTodayTimed"}
              >
                <Badge
                  badgeContent={timedAssignment}
                  max={999}
                  color="secondary"
                >
                  {" "}
                  <AccessAlarmIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          </IconButton>
          <IconButton aria-label="Due Today" color="inherit">
            <Tooltip title="Due Today" arrow>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                component={Link}
                to={"/dueToday"}
              >
                <Badge badgeContent={dueToday} max={999} color="secondary">
                  <AssignmentRoundedIcon className={classes.red} />
                </Badge>
              </IconButton>
            </Tooltip>
          </IconButton>
          <IconButton aria-label="Due Past" color="inherit">
            <Tooltip title="Due Past" arrow>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                component={Link}
                to={"/duePast"}
              >
                <Badge badgeContent={duePast} max={999} color="secondary">
                  <AssignmentRoundedIcon className={classes.grey} />
                </Badge>
              </IconButton>
            </Tooltip>
          </IconButton>
          <Button color="inherit" onClick={onLogOut}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
