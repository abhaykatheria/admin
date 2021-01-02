import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import app from "firebase/app";
import "firebase/firebase-firestore";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { CircularProgress } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import PriorityHighIcon from "@material-ui/icons/PriorityHigh";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    backgroundColor: "lightBlue",
    boxShadow: "3px 3px 5px 6px rgba(255,255,255,0.6)",
    "&:hover": {
      boxShadow: "3px 3px 5px 6px rgba(255,255,255,1)",
    },
  },
  button: {
    margin: theme.spacing(1),
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
}));

function DuePast() {
  const [assignments, setAssignments] = useState();
  const classes = useStyles();

  useEffect(() => {
    window.scrollTo(0, 0);
    const db = app.firestore();
    return db.collection("assignments").onSnapshot((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));
      console.log(data);
      const data1 = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].satus === "ongoing") {
          console.log(
            moment(data[i].due_date.toDate().toDateString()).format("DD/MM/YYYY"),
            moment(new Date()).format("DD/MM/YYYY")
          );
          if (
            moment(data[i].due_date.toDate().toDateString()) <
            moment()
          )
            data1.push(data[i]);
        }
      }

      setAssignments(data1);
      // setTutors(data);
    });
  }, []);

  if (assignments) console.log(assignments);

  return (
    <div className="body">
      <div className="wrapper">
        {assignments !== undefined ? (
          assignments.map((assignment) => (
            <Card className={classes.root} variant="outlined">
              <CardContent>
                <Typography variant="body2" component="p">
                  <b>Student</b> = {assignment.student}
                  <br />
                  <b>Subject</b> = {assignment.subject}
                  <br />
                  <b>Tutor</b> = {assignment.tutor}
                  <br />
                  <b>Price</b> = {assignment.price}$<br />
                  <b>Amount Paid</b> = {assignment.amount_paid}$<br />
                  <b>Tutor fee</b> = {assignment.tutor_fee}$<br />
                  <b>Assigned Date</b> ={" "}
                  {assignment.assigned_date.toDate().toDateString()} at{" "}
                  {assignment.assigned_date.toDate().toLocaleTimeString()}
                  <br />
                  <b>Due Date</b> = {assignment.due_date
                    .toDate()
                    .toDateString()} at{" "}
                  {assignment.assigned_date.toDate().toLocaleTimeString()}
                  <br />
                  <b>Status</b> = {assignment.satus}
                </Typography>
              </CardContent>
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
export default DuePast;
