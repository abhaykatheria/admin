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
import Badge from "@material-ui/core/Badge";
import { green, grey, red } from "@material-ui/core/colors";
import Tooltip from "@material-ui/core/Tooltip";
import { useState } from "react";
import app from "firebase/app";
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
  const [totalAssignments, setTotalAssignments] = useState();
  const [completed, setCompleted] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);
    const db = app.firestore();
    return db.collection("assignments").onSnapshot((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));
      // console.log(data);
      var total = data.length;
      var compl = 0;
      for (var i = 0; i < data.length; i++) {
        if (data[i].satus === "completed") {
          compl++;
        }
      }
      setTotalAssignments(total);
      setCompleted(compl);
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
            <Tooltip title="Total Assignment" arrow>
              <Badge
                badgeContent={totalAssignments}
                max={999}
                color="secondary"
              >
                {" "}
                <AssignmentRoundedIcon className={classes.grey} />
              </Badge>
            </Tooltip>
          </IconButton>
          <IconButton aria-label="Completed Assignment" color="inherit">
            <Tooltip title="Completed Assignment" arrow>
              <Badge badgeContent={completed} max={999} color="secondary">
                <AssignmentRoundedIcon className={classes.green} />
              </Badge>
            </Tooltip>
          </IconButton>
          <IconButton aria-label="In Process" color="inherit">
            <Tooltip title="Ongoing" arrow>
              <Badge
                badgeContent={totalAssignments - completed}
                max={999}
                color="secondary"
              >
                <AssignmentRoundedIcon className={classes.red} />
              </Badge>
            </Tooltip>
          </IconButton>
          <Button color="inherit" component={Link} to="/viewStud">
            Search
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
