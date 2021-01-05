import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import app from "firebase/app";
import "firebase/firebase-firestore";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { CircularProgress } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import moment from "moment";
import JSZip from "jszip";
import JSZipUtils from "jszip-utils";
import saveAs from "save-as";
import GetAppRoundedIcon from "@material-ui/icons/GetAppRounded";
import { green, grey } from "@material-ui/core/colors";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import PriorityHighIcon from "@material-ui/icons/PriorityHigh";

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

export default function TestDisplay(props) {
  const [assignment, setAssignment] = useState(props.location.state.data);
  const [typeOfAssignment, setTypeOfAssignment] = useState(
    props.location.state.type
  );
  console.log(assignment)
  const classes = useStyles();
  const [ar, setAr] = useState([]);

  useEffect(() => {}, [props]);

  return (
    <div className="body">
      <div className="wrapper">
        {assignment !== undefined ? (
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
                {moment(new Date(assignment.assigned_date)).format("DD/MM/YYYY")} 
                <br />
                <b>Due Date </b> = {moment(new Date(assignment.due_date)).format("DD/MM/YYYY")}
                <br />
                <b>Status </b> = {assignment.satus}
              </Typography>
            </CardContent>
            <CardActions>
              <div style={{ display: "flex", justifyContent: "center" }}>
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
                          db.collection(typeOfAssignment)
                            .doc(assignment.id)
                            .delete();
                          setAssignment();
                        }}
                      ></Button>
                    </Tooltip>
                    <Tooltip title="Change Due Date" arrow>
                      <Button
                        variant="contained"
                        className={`${classes.button} ${classes.grey}`}
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
                          db.collection(typeOfAssignment)
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
                        className={`${classes.button} ${classes.green}`}
                        children={<CheckCircleIcon />}
                        onClick={() => {
                          const db = app.firestore();
                          db.collection(typeOfAssignment)
                            .doc(assignment.id)
                            .update({
                              satus: "completed",
                            });
                          console.log(assignment);
                        }}
                      ></Button>
                    </Tooltip>
                  </div>
                  <Tooltip title="Download files" arrow>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      children={<GetAppRoundedIcon />}
                      onClick={() => {
                        let location = "/files/" + assignment.ass_id.toString();
                        var temp = [];
                        var storageRef = app.storage().ref(location);
                        // console.log(storageRef)
                        storageRef
                          .listAll()
                          .then(function (result) {
                            result.items.forEach(function (imageRef) {
                              // console.log(imageRef)
                              imageRef
                                .getDownloadURL()
                                .then(function (url) {
                                  temp.push(url.toString());
                                  // console.log(ar)
                                })
                                .catch(function (error) {
                                  // Handle any errors
                                });
                            });
                          })
                          .catch(function (error) {
                            // Handle any errors
                          });

                        // console.log(location,ar,ar.length)

                        setAr(temp);
                        console.log(ar);
                        if (ar.length !== 0) func(ar, assignment);
                      }}
                    ></Button>
                  </Tooltip>
                </CardActions>
              </div>
            </CardActions>
          </Card>
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
function get_url_extension(url) {
  return url.split(/[#?]/)[0].split(".").pop().trim();
}

async function func(ar, assignment) {
  const zip = new JSZip();
  let count = 0;
  const zipFilename = assignment.student + "-assignment.zip";
  console.log(ar, typeof ar);
  // await new Promise(r => setTimeout(r, 5000));

  for (let [key, value] of Object.entries(ar)) {
    let url = value;
    console.log(url);
    const file = await JSZipUtils.getBinaryContent(url);
    // await new Promise(r => setTimeout(r, 5000));
    // const ext=getExtension(url)
    // console.log(ext)
    const filename = key + "." + get_url_extension(url);
    console.log(file);

    zip.file(filename, file, { binary: true });
  }

  // for (let i=0;i<ar.length;i++) {
  //     let url = ar[i];
  //     console.log(url);
  //     // var xhr = new XMLHttpRequest();
  //     // xhr.responseType = 'blob';
  //     // xhr.onload = function (event) {
  //     //     var blob = xhr.response;
  //     // };
  //     // xhr.open('GET', url);
  //     // xhr.send();
  //     const file = await JSZipUtils.getBinaryContent(url)
  //     const filename = url;
  //     zip.file(filename, file, { blob: true });
  // }

  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, zipFilename);
  });
}
