import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import app from "firebase/app";
import "firebase/firebase-firestore";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { Link } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import Divider from "@material-ui/core/Divider";
import Tooltip from "@material-ui/core/Tooltip";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
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

export default function ViewStudent() {
  const [students, setStudents] = useState();
  const [searchResult,setSearchResult] = useState();
  const classes = useStyles();
  const classes2 = useStyles2();

  useEffect(() => {
    const db = app.firestore();
    window.scrollTo(0, 0);
    return db.collection("students").onSnapshot((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));
      console.log(data); // <------
      setStudents(data);
      setSearchResult(data);
    });
  }, []);

  const onSearchTutor = (event,value) => {
    if(value===null) {
      setSearchResult(students)
      console.log(students)
    }else{
      const data1 = [];
      for (var i = 0; i < students.length; i++) {
        if (students[i].name === value) data1.push(students[i]);
      }
      console.log(data1)
      setSearchResult(data1)
    }
    
  }

  return (
    <div className="body">
    {students !== undefined ? (
      <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
        <div style={{ width: 300,paddingLeft:"5px" }}>
          <Autocomplete
            id="free-solo-demo"
            freeSolo
            options={students.map((assign)=>assign.name)}
            onChange = {onSearchTutor}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search by student name "
                margin="normal"
                variant="outlined"
              />
            )}
          />
          </div>
          </Grid>
    ):<div></div>}
      <div className="wrapper">
        {searchResult !== undefined ? (
          searchResult.map((student) => (
            <Card className={classes2.root} variant="outlined">
              <CardContent>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src={avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={student.name}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          className={classes.inline}
                          color="textPrimary"
                        >
                          {student.email}
                          <br />
                          {student.phone_number}
                        </Typography>
                        <br />
                        Collection: {student.collections}
                        <br />
                        {student.comment}
                      </React.Fragment>
                    }
                  />
                </ListItem>
              </CardContent>
              <CardActions>
                <div style={{ margin: "0 auto", textAlign: "center" }}>
                  <Tooltip title="All Assignment" arrow>
                    <Link
                      to={{
                        pathname: "/dis",
                        state: {
                          name: student.name,
                          fieldName: "student",
                        },
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes2.button}
                        children={<AssignmentRoundedIcon />}
                      ></Button>
                    </Link>
                  </Tooltip>
                  <Tooltip title="Edit Details" arrow>
                    <Link
                      to={{
                        pathname: "/editStudent",
                        state: {
                          data: student,
                        },
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        className={`${classes2.button} ${classes2.green}`}
                        children={<EditRoundedIcon />}
                      ></Button>
                    </Link>
                  </Tooltip>
                  <Tooltip title="Delete Tutor" arrow>
                    <Button
                      variant="contained"
                      color="secondary"
                      className={classes2.button}
                      children={<DeleteIcon />}
                      onClick={() => {
                        const db = app.firestore();
                        db.collection("students").doc(student.id).delete();
                        console.log(students);
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
