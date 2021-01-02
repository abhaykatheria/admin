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
import Tooltip from "@material-ui/core/Tooltip";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
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
    window.scrollTo(0, 0);
    const db = app.firestore();
    return db.collection("assignments").onSnapshot((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));
      console.log(data);
      const data1 = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].satus === "ongoing") data1.push(data[i]);
      }

      data1.sort((a, b) =>
        a.due_date > b.due_date ? 1 : b.due_date > a.due_date ? -1 : 0
      );

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
              <CardActions>
                <div style={{ margin: "0 auto", textAlign: "center" }}>
                  <Tooltip title="Delete" arrow>
                    <Button
                      variant="contained"
                      color="secondary"
                      className={classes.button}
                      children={<DeleteIcon />}
                      onClick={() => {
                        const db = app.firestore();
                        db.collection("assignments")
                          .doc(assignment.id)
                          .delete();
                        console.log(assignment);
                      }}
                    ></Button>
                  </Tooltip>
                  <Tooltip title="Change Due Date" arrow>
                    <Button
                      variant="contained"
                      color="secondary"
                      className={classes.button}
                      children={<PriorityHighIcon />}
                      onClick={() => {
                        var dateString = window.prompt(
                          "Enter the new due date in this format:- DD/MM/YYY"
                        );
                        if (dateString == null) return;
                        var dateObj = moment(dateString, "DD/MM/YYYY")._d;
                        if (dateString === "" || dateObj === "Invalid Date")
                          alert("Enter a valid date");
                        const db = app.firestore();
                        console.log(dateString, dateObj);
                        db.collection("assignments").doc(assignment.id).update({
                          due_date: dateObj,
                        });
                      }}
                    ></Button>
                  </Tooltip>
                  <Tooltip title="Mark As Completed" arrow>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      children={<CheckCircleIcon />}
                      onClick={() => {
                        const db = app.firestore();
                        db.collection("assignments").doc(assignment.id).update({
                          satus: "completed",
                        });
                        console.log(assignment);
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

export default InProgressAssignment;
