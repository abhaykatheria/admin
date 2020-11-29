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
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import moment from 'moment'

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

function InProgressAssignment() {
  const [assignments, setAssignments] = useState();
  const classes = useStyles();

  useEffect(() => {
    const db = app.firestore();
    return db.collection("assignments").onSnapshot((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));
      console.log(data);
      const data1 = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].satus === "ongoing") data1.push(data[i]);
      }

      data1.sort((a, b) => (a.due_date > b.due_date) ? 1 : ((b.due_date > a.due_date) ? -1 : 0))

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
                  Student = {assignment.student}
                  <br />
                  Subject = {assignment.subject}
                  <br />
                  Tutor = {assignment.tutor}
                  <br />
                  Price = {assignment.price}$<br />
                  Amount Paid = {assignment.amount_paid}$<br />
                  Tutor fee = {assignment.tutor_fee}$<br />
                  Assigned Date ={" "}
                  {assignment.assigned_date.toDate().toDateString()} at{" "}
                  {assignment.assigned_date.toDate().toLocaleTimeString()}
                  <br />
                  Due Date = {assignment.due_date
                    .toDate()
                    .toDateString()} at{" "}
                  {assignment.assigned_date.toDate().toLocaleTimeString()}
                  <br />
                  Status = {assignment.satus}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    const db = app.firestore()
                    db.collection("assignments").doc(assignment.id).delete()
                    console.log(assignment)
                  }}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  startIcon={<PriorityHighIcon />}
                  onClick={() => {
                    var dateString = window.prompt("Enter the new due date in this format:- DD/MM/YYY")
                    if (dateString == null)
                      return
                    var dateObj = moment(dateString, "DD/MM/YYYY")._d;
                    if (dateString == '' || dateObj == 'Invalid Date')
                      alert('Enter a valid date')
                    const db = app.firestore()
                    console.log(dateString, dateObj);
                    db.collection("assignments").doc(assignment.id).update({
                      due_date: dateObj
                    })
                  }}
                >
                  Change due date
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  startIcon={<CheckCircleIcon />}
                  onClick={() => {
                    const db = app.firestore()
                    db.collection("assignments").doc(assignment.id).update({
                      satus: "completed"
                    })
                    console.log(assignment)
                  }}
                >
                  Mark as completed
                </Button>
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

export default InProgressAssignment;
