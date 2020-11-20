import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import app from "firebase/app";
import "firebase/firebase-firestore";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
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
import "./tutor.css"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "36ch",
    margin : "auto",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
}));

const useStyles2 = makeStyles({
  root: {
    minWidth: 275,
    backgroundColor: "lightBlue",
    boxShadow: "3px 3px 5px 6px rgba(255,255,255,0.6)",
    "&:hover": {
      boxShadow: "3px 3px 5px 6px rgba(255,255,255,1)",
    },
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
});

export default function ViewTutor() {
  const [tutors, setTutors] = useState();
  const classes = useStyles();
  const classes2 = useStyles2();

  useEffect(() => {
    const db = app.firestore();
    return db.collection("tutors").onSnapshot((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));
      console.log(data); // <------
      setTutors(data);
    });
  }, []);

  console.log(tutors);

  return (
      <div className="body">
    <div className = "wrapper">
      {tutors !== undefined ? (
        tutors.map((tutor) => (
          <Card className={classes2.root} variant="outlined">
            <CardContent>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src={avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={tutor.name}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        {tutor.email}
                      </Typography>
                      <br />
                      Dues: {tutor.dues}
                      <br />
                      Country: {tutor.country}
                    </React.Fragment>
                  }
                />
              </ListItem>
            </CardContent>
          </Card>
        ))
      ) : (
        <CircularProgress />
      )}
    </div>
    </div>
  );
}
