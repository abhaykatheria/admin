import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import app from "firebase/app";
import "firebase/firebase-firestore";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { Link } from "react-router-dom";
import Divider from "@material-ui/core/Divider";
import Tooltip from "@material-ui/core/Tooltip";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import PriorityHighIcon from "@material-ui/icons/PriorityHigh";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { CircularProgress } from "@material-ui/core";
import avatar from "../images/avat.jpg";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import AssignmentRoundedIcon from "@material-ui/icons/AssignmentRounded";
import { green, grey, red } from "@material-ui/core/colors";
import "./tutor.css";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "36ch",
    margin: "auto",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
}));

const useStyles2 = makeStyles((theme) => ({
  root: {
    minWidth: "50%",
    backgroundColor: "lightBlue",
    boxShadow: "3px 3px 5px 6px rgba(255,255,255,0.6)",
    "&:hover": {
      boxShadow: "3px 3px 5px 6px rgba(255,255,255,1)",
    },
  },
  button: {
    margin: theme.spacing(2),
    display: "inline-flex",
    horizontalAlign: "middle",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  green: {
    color: "#fff",
    backgroundColor: green[700],
    "&:hover": {
      backgroundColor: green[800],
    },
  },
  grey: {
    color: "#fff",
    backgroundColor: grey[700],
    "&:hover": {
      backgroundColor: grey[800],
    },
  },
}));

export default function PaymentCollection(props) {
  const [dues, setDues] = useState();
  const [duesMap, setDuesMap] = useState();
  const [id, setId] = useState(props.location.state.data.id);
  const [fieldName, setFieldName] = useState(props.location.state.fieldName);
  const classes = useStyles();
  const classes2 = useStyles2();

  useEffect(() => {
    console.log(id)
    const db = app.firestore();
    window.scrollTo(0, 0);
    db.collection("payment_collection")
      .where('studentId', "==", id)
      .onSnapshot((snapshot) => {
        const data = [];
        snapshot.forEach((doc) =>
          data.push({ ...doc.data(), id: doc.id, studentId: doc.data().studentId })
        );
        console.log(data); // <------
        data.sort((a, b) =>
          a.due_date.seconds > b.due_date.seconds
            ? 1
            : b.due_date.seconds > a.due_date.seconds
              ? -1
              : 0
        );
        setDues(data);
      });

    db.collection("students").onSnapshot((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));
      // console.log(data); // <------

      const map = {};

      for (let i = 0; i < data.length; i++) {
        map[data[i].id] = data[i].collections;
      }
      console.log(map);
      setDuesMap(map);
    });
  }, []);

  return (
    <div className="body">
      <div className="wrapper">
        {dues !== undefined ? (
          dues.map((assignment) => (
            <Card className={classes2.root} variant="outlined">
              <CardContent>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src={avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={assignment.student}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          className={classes.inline}
                          color="textPrimary"
                        >
                          {/* {tutor.email} */}
                        </Typography>
                        <br />
                        Assignment Payment: {assignment.pending}
                        <br />
                        Assignment Due Date:{" "}
                        {new Date(
                          assignment.due_date.seconds * 1000
                        ).toLocaleString()}
                      </React.Fragment>
                    }
                  />
                </ListItem>
              </CardContent>
              <CardActions>
                <div style={{ margin: "0 auto", textAlign: "center" }}>
                  <Tooltip title="Mark as paid" arrow>
                    <Button
                      variant="contained"
                      color="primary"
                      className={`${classes2.button} ${classes2.green}`}
                      children={<CheckCircleIcon />}
                      onClick={() => {
                        console.log(assignment);
                        deleteDoc(assignment);
                        updateDues(duesMap[assignment.studentId], assignment);
                      }}
                    ></Button>
                  </Tooltip>
                  <Tooltip title="Change payment amount" arrow>
                    <Button
                      variant="contained"
                      color="secondary"
                      className={`${classes2.button} ${classes2.green}`}
                      children={<PriorityHighIcon />}
                      onClick={() => {
                        let amount = prompt('Enter changed payment amount here');
                        amount = parseInt(amount)

                        if (isNaN(amount)) {
                          alert("Enter valid amount")
                          return
                        }

                        console.log(assignment, amount);
                        updateDues(duesMap[assignment.studentId], assignment, amount);
                        assignment.pending = amount
                        updatePaymentCol(assignment)
                      }}
                    ></Button>
                  </Tooltip>
                </div>
              </CardActions>
            </Card>
          ))
        ) : (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <CircularProgress />
            </div>
          )}
      </div>
    </div>
  );
}

async function deleteDoc(assignment) {
  console.log(assignment.id);
  await app
    .firestore()
    .collection("payment_collection")
    .doc(assignment.id)
    .delete().then(() => {
      alert("Collected Successfully")
    })
}

async function updatePaymentCol(assignment){
  await app.firestore().collection('payment_collection').doc(assignment.id).update({
    pending: assignment.pending
  }).then(function () {
    alert('Updated Successfully')
  })
}

async function updateDues(dues, assignment, amount) {
  console.log(dues);
  if (isNaN(amount))
    amount = 0
  await app
    .firestore()
    .collection("students")
    .doc(assignment.studentId)
    .update({
      collections: dues - assignment.pending + amount,
    });
}
