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
import AccessAlarmRoundedIcon from '@material-ui/icons/AccessAlarmRounded';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
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

  useEffect(() => {
    window.scrollTo(0, 0);
    const db = app.firestore();
    console.log(new Date().toString());
    db.collection("timed").onSnapshot((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));
      // console.log(data);
      var total = 0;
      for (var i = 0; i < data.length; i++) {
        var date = moment(data[i].due_date.toDate().toDateString()).format(
          "DD/MM/YYYY"
        );
        if (
          data[i].satus === "ongoing" &&
          date === moment().format("DD/MM/YYYY")
        ) {
          total++;
          console.log(date)
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
          <Typography variant="h6" className={classes.title}>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
          </Typography>
          <IconButton aria-label="Total Assignment" color="inherit">
            <Tooltip title="Timed Assignment" arrow>
              <Badge badgeContent={timedAssignment} max={999} color="secondary">
                {" "}
                <AccessAlarmIcon className={classes.green} />
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
