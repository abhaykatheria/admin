import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import app from "firebase/app";
import "firebase/firebase-firestore";
import Tooltip from "@material-ui/core/Tooltip";
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
import SearchBar from "material-ui-search-bar";
import SearchIcon from "@material-ui/icons/Search";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
    display: "inline-flex",
    horizontalAlign: "middle"
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

function ViewStudentSearch() {
  const [name, setName] = useState();
  const [assignments, setAssignments] = useState();
  const [open,setOpen] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  const onSearch = (name) => {
    var temp = []
    if (name !== undefined) {
      const db = app.firestore();
      return db
        .collection("assignments")
        .where("student", "==", name)
        .onSnapshot((snapshot) => {
          const data = [];
          snapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));
          setAssignments(data);
          temp = data
          if (temp.length===0){
            setOpen(true)
          }
        }) 
    } else {
      setOpen(true)
      return console.log("Nothing");
    }
  };
  if (assignments) console.log(assignments);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div style = {{background:"white"}}>
      <div style={{ margin: "10px" }}>
        <SearchBar
          value={name}
          cancelOnEscape={true}
          closeIcon={<SearchIcon />}
          onChange={(newName) => setName(newName)}
          onCancelSearch={() => onSearch(name)}
          onRequestSearch={() => onSearch(name)}
        />
      </div>
      <div>
      <Snackbar open={open} autoHideDuration={1400} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          No Search Found!!
        </Alert>
      </Snackbar>
      </div>
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
                          db.collection("assignments")
                            .doc(assignment.id)
                            .update({
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
                          db.collection("assignments")
                            .doc(assignment.id)
                            .update({
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
             <p> Begin Searching ...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewStudentSearch;
