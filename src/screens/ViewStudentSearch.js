import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import app from "firebase/app";
import "firebase/firebase-firestore";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Display from "./Display"
import SearchBar from "material-ui-search-bar";
import SearchIcon from "@material-ui/icons/Search";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

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
}));

function ViewStudentSearch() {
  const [name, setName] = useState();
  const [assignments, setAssignments] = useState();
  const [student, setStudent] = useState();
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onSearch = (name) => {
    const db = app.firestore();
    console.log(name)
    if (name !== undefined ) {
      return (
        db
          .collection("students")
          .where("name", "==", name)
          .onSnapshot((snapshot) => {
            const data = [];
            snapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));
            console.log(data);
            setStudent(data);
            if (data === undefined || data.length === 0){
               setOpen(true);
              setAssignments([])}
            else setOpen(false);
          }),
        db
          .collection("assignments")
          .where("student", "==", name)
          .onSnapshot((snapshot) => {
            const data2 = [];
            snapshot.forEach((doc) =>
              data2.push({ ...doc.data(), id: doc.id })
            );
            console.log(data2);
            setAssignments(data2);
          })
      );
    } else {
      setOpen(true);
      setAssignments([])
      console.log("None");
    }
  };
  if (assignments) console.log(assignments);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      setOpen(false);
      setAssignments([])
      return;
    }

    setOpen(false);
    setAssignments([])
  };

  return (
    <div style={{ background: "white" }}>
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
      {student !== undefined ? (
        student.map((stud) => (
          <div classname = "wrapper">
            <Card className={classes.root} variant="outlined">
              <CardContent>
                <Typography variant="body2" component="p">
                  <b>Name</b> = {stud.name}
                  <br />
                  <b>Email</b> = {stud.email}
                  <br />
                  <b>Collection</b> = {stud.collection}$
                  <br />
                  <b>Timezone</b> = {stud.timezone}<br />
                </Typography>
              </CardContent>
            </Card>
          </div>
        ))
      ) : (
        <div> </div>
      )}
      <div className="body">
          {assignments !== undefined ? (
           <Display data={assignments}/>
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
  );
}

export default ViewStudentSearch;
