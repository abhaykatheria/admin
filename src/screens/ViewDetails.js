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
import MoneyIcon from "@material-ui/icons/Money";
import { Link } from "react-router-dom";
import JSZip from "jszip";
import JSZipUtils from "jszip-utils";
import saveAs from "save-as";
import GetAppRoundedIcon from "@material-ui/icons/GetAppRounded";
import { green, grey } from "@material-ui/core/colors";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import PriorityHighIcon from "@material-ui/icons/PriorityHigh";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: "100%",
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

export default function ViewDetails(props) {
  const [assignment, setAssignment] = useState(props.location.state.data);
  const [typeOfAssignment, setTypeOfAssignment] = useState(
    props.location.state.type
  );
  // const [nav,setNav] = useState()
  // if (props.location.state.type==="timed"){
  //   setNav("/editTimed")
  // }else{
  //   setNav("/")
  // }
  const [assignedDate, setAssignedDate] = useState(
    props.location.state.assigned_date
  );
  const [dueDate, setDueDate] = useState(props.location.state.due_date);
  const [startDate, setStartDate] = useState(props.location.state.start_date);
  const [tutorId, setTutorId] = useState();
  const [tutorDues, setTutorDues] = useState();
  const [duesId, setDuesId] = useState();

  console.log(startDate);
  console.log(assignment);
  const classes = useStyles();
  const [ar, setAr] = useState([]);

  useEffect(() => {
    const db = app.firestore();
    window.scrollTo(0, 0);
    db.collection("tutors")
      .where("name", "==", props.location.state.data.tutor)
      .onSnapshot((snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
          console.log(doc.data())
          setTutorId(doc.id);
          setTutorDues(doc.data().dues);
        });
        console.log(data); // <------
        console.log(tutorId, tutorDues)
      });
    db.collection("dues")
      .where("assg_id", "==", props.location.state.data.ass_id)
      .onSnapshot((snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
          setDuesId(doc.id)
        });
      });

  }, [props]);

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
                <b>Assigned Date</b> = {assignedDate}
                <br />
                <b>Due Date </b> = {dueDate}
                <br />
                <b>Status </b> = {assignment.satus}
                <br />
                {typeOfAssignment === "timed" ? (<div><b>Duration</b> = {assignment.duration.hours} hours {assignment.duration.minutes} minutes</div>) : <b></b>}
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
                    <Tooltip title="Edit" arrow>
                      {typeOfAssignment === "timed" ? (
                        <Link
                          to={{
                            pathname: "/editTimed",
                            state: {
                              data: assignment,
                              due_date: dueDate,
                              assigned_date: assignedDate,
                              start_date: startDate,
                            },
                          }}
                        >
                          <Button
                            variant="contained"
                            className={`${classes.button} ${classes.grey}`}
                            children={<PriorityHighIcon />}
                            onClick={() => { }}
                          ></Button>
                        </Link>
                      ) : (
                          <Link
                            to={{
                              pathname: "/editAssignment",
                              state: {
                                data: assignment,
                                due_date: dueDate,
                                assigned_date: assignedDate,
                              },
                            }}
                          >
                            <Button
                              variant="contained"
                              className={`${classes.button} ${classes.grey}`}
                              children={<PriorityHighIcon />}
                              onClick={() => { }}
                            ></Button>
                          </Link>
                        )}
                    </Tooltip>
                    {assignment.satus === "completed" ? (
                      <Tooltip title="Mark As Ongoing" arrow>
                        <Button
                          variant="contained"
                          className={`${classes.button} ${classes.grey}`}
                          children={<CheckCircleIcon />}
                          onClick={() => {
                            console.log(typeOfAssignment, assignment.id);
                            const db = app.firestore();
                            console.log(typeOfAssignment);
                            db.collection(typeOfAssignment)
                              .doc(assignment.id)
                              .update({
                                satus: "ongoing",
                              });
                            console.log(assignment);

                            db.collection('tutors').doc(tutorId).update({
                              dues: tutorDues - assignment.tutor_fee
                            })

                            db.collection('dues').doc(duesId).delete().then(function () {
                              alert('Marked successfully')
                            })

                          }}
                        ></Button>
                      </Tooltip>
                    ) : (
                        <Tooltip title="Mark As Completed" arrow>
                          <Button
                            variant="contained"
                            className={`${classes.button} ${classes.green}`}
                            children={<CheckCircleIcon />}
                            onClick={() => {
                              console.log(typeOfAssignment, assignment.id);
                              const db = app.firestore();
                              console.log(typeOfAssignment);
                              db.collection(typeOfAssignment)
                                .doc(assignment.id)
                                .update({
                                  satus: "completed",
                                });
                              console.log(assignment);

                              db.collection('dues').add({
                                assg_id: assignment.ass_id,
                                due_date: assignment.due_date,
                                status: "pending",
                                tutor: assignment.tutor,
                                tutor_fee: parseInt(assignment.tutor_fee),
                                tutorId: tutorId,
                                student: assignment.student,
                                assigned_date: assignment.assigned_date,
                                subject: assignment.subject
                              }).then(function (id) {
                                console.log(id.id)
                                if (id.id !== '') {
                                  alert('Marked succesfully')

                                }
                                else
                                  alert('Some error occured, try again')
                              });

                              db.collection('tutors').doc(tutorId).update({
                                dues: tutorDues + assignment.tutor_fee
                              })


                            }}
                          ></Button>
                        </Tooltip>
                      )}
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
                  <Tooltip title="Edit Dues" arrow>
                    <Link
                      to={{
                        pathname: "/indiDues",
                        state: {
                          fieldName: "assg_id",
                          ass_id: assignment.ass_id,
                        },
                      }}
                    >
                      <Button
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        children={<MoneyIcon />}
                      ></Button>
                    </Link>
                  </Tooltip>
                  <Tooltip title="Edit payment collection" arrow>
                    <Link
                      to={{
                        pathname: "/indiPayCol",
                        state: {
                          fieldName: "assg_id",
                          ass_id: assignment.ass_id,
                        },
                      }}
                    >
                      <Button
                        variant="contained"
                        color="secondary"
                        className={`${classes.button} ${classes.green}`}
                        children={<AttachMoneyIcon />}
                      ></Button>
                    </Link>
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
    // var temp = url.split(RegExp(% 2..*% 2F(.*?) \?alt))[1].split(".")[0];
    console.log(url);
    console.log();
    const filename = url.split("/").pop().split("#")[0].split("?")[0];
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
