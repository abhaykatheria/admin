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
  const [completeData,setCompleteData] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);
    const db = app.firestore();
    const data1 = [];
    console.log(new Date().toString());
    db.collection("timed").onSnapshot((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));
      // console.log(data);
      var total = 0;
      for (var i = 0; i < data.length; i++) {
        data1.push({...data})
        var date = moment(data[i].due_date.toDate().toDateString()).format(
          "DD/MM/YYYY"
        );
        if (
          data[i].satus === "ongoing" &&
          date === moment().format("DD/MM/YYYY")
        ) {
          total++;
          console.log(date);
        }
      }
      setTimedAssignment(total);
    });
    db.collection("assignments").onSnapshot((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));
      // console.log(data);
      var today = 0;
      var past = 0;
      data1.push({...data})
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
          data[i].satus === "ongoing" &&
          date < moment().format("DD/MM/YYYY")
        ) {
          past++;
        }
      }
      setDueToday(today);
      setDuePast(past);
      console.log(data1)
      setCompleteData(data1)
    });
  }, []);

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
                  console.log("Khatam kro be 🤑");
                }}
              />
            </Tooltip>
          </IconButton>
          <IconButton aria-label="Total Assignment" color="inherit">
            <Tooltip title="Timed Assignment" arrow>
              <Badge badgeContent={timedAssignment} max={999} color="secondary">
                {" "}
                <AccessAlarmIcon />
              </Badge>
            </Tooltip>
          </IconButton>
          <IconButton aria-label="Due Today" color="inherit">
            <Tooltip title="Due Today" arrow>
              <Badge badgeContent={dueToday} max={999} color="secondary">
                <AssignmentRoundedIcon className={classes.grey} />
              </Badge>
            </Tooltip>
          </IconButton>
          <IconButton aria-label="Due Past" color="inherit">
            <Tooltip title="Due Past" arrow>
              <Badge badgeContent={duePast} max={999} color="secondary">
                <AssignmentRoundedIcon className={classes.red} />
              </Badge>
            </Tooltip>
          </IconButton>
          <Button color="inherit" component={Link} to="/viewStudent">
            Search
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
