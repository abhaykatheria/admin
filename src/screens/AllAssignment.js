import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import app from "firebase/app";
import "firebase/firebase-firestore";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from '@material-ui/core/TextField';
import { CircularProgress } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import moment from "moment";
import JSZip from "jszip";
import JSZipUtils from "jszip-utils";
import saveAs from "save-as";
import GetAppRoundedIcon from "@material-ui/icons/GetAppRounded";
import { green } from "@material-ui/core/colors";
import Radio from "@material-ui/core/Radio";


const GreenRadio = withStyles({
  root: {
    color: green[400],
    "&$checked": {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

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

function AllAssignment() {
  const [assignments, setAssignments] = useState();
  const classes = useStyles();
  const [ar, setAr] = useState([]);
  const [currOption, setCurrOption] =useState("Due Date(Asc)")

  useEffect(() => {
    window.scrollTo(0, 0);
    const db = app.firestore();
    return db.collection("assignments").onSnapshot((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));
      // console.log(data);
      const data1 = [];
      for (var i = 0; i < data.length; i++) {
        data1.push(data[i]);
      }

      data1.sort((a, b) =>
        a.due_date > b.due_date ? 1 : b.due_date > a.due_date ? -1 : 0
      );

      setAssignments(data1);
      // setTutors(data);
    });
  }, []);

  const handleDueDateAsc = () => {
    var data1 = assignments;
    data1.sort((a, b) =>
      a.due_date > b.due_date ? 1 : b.due_date > a.due_date ? -1 : 0
    );
    setAssignments(data1);
  };

  const handleDueDateDesc = () => {
    var data1 = assignments;
    data1.sort((a, b) =>
      a.due_date < b.due_date ? 1 : b.due_date < a.due_date ? -1 : 0
    );
    setAssignments(data1);
    console.log(data1);
  };

  const handleAssignedDateAsc = () => {
    var data1 = assignments;
    data1.sort((a, b) =>
      a.assigned_date > b.assigned_date
        ? 1
        : b.assigned_date > a.assigned_date
        ? -1
        : 0
    );
    setAssignments(data1);
    console.log(data1);
  };

  const handleAssignedDateDesc = () => {
    var data1 = assignments;
    data1.sort((a, b) =>
      a.assigned_date < b.assigned_date
        ? 1
        : b.assigned_date < a.assigned_date
        ? -1
        : 0
    );
    setAssignments(data1);
  };

  const options  = [
    {
        value: "Due Date (Asc)"
    },
    {
      value: "Due Date (Desc)"
  },
  {
      value: "Assigned Date (Asc)"
  },
  {
      value: "Assigned Date (Desc)"
  },
]

const handleChange = (event) => {
    setCurrOption(event.target.value)
    console.log(event.target.value)
    if(event.target.value === "Due Date (Asc)"){
        handleDueDateAsc()
    }else if(event.target.value === "Due Date (Desc)"){
        handleDueDateDesc()
    }else if(event.target.value === "Assigned Date (Asc)"){
        handleAssignedDateAsc()
    }else if(event.target.value === "Assigned Date (Desc)"){
        handleAssignedDateDesc()
    }
}

  return (
    <div className="body">
      <div style={{ paddingTop: "7px", paddingRight: "1px" }}>
        <Grid container justify="flex-end">
        
        <TextField
          id="outlined-select-currency-native"
          color="secondary"
          select
          label="Sort By"
          defaultValue = "Due Date(Asc)"
          value={currOption}
          onChange={handleChange}
          SelectProps={{
            native: true,
          }}
          variant="outlined"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.value}
            </option>
          ))}
        </TextField>
        </Grid>
      </div>
      <div className="wrapper">
        {assignments !== undefined ? (
          assignments.map((assignment) => (
            <Card className={classes.root} variant="outlined">
              <CardContent>
                <Grid container justify="flex-end">
                {}
                  <Tooltip title="General Assignment" arrow>
                    <GreenRadio
                      checked={true}
                      value="c"
                      name="radio-button-demo"
                      inputProps={{ "aria-label": "C" }}
                    />
                  </Tooltip>
                </Grid>
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
                  <b>Due Date </b>= {assignment.due_date
                    .toDate()
                    .toDateString()} at{" "}
                  {assignment.assigned_date.toDate().toLocaleTimeString()}
                  <br />
                  <b>Status </b> = {assignment.satus}
                </Typography>
              </CardContent>
              <CardActions>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Tooltip title="Download files" arrow>
                    <Button
                      variant="contained"
                      color="secondary"
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
                        // console.log(ar)
                        func(ar, assignment);
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

function get_url_extension(url) {
  return url.split(/[#?]/)[0].split(".").pop().trim();
}

async function func(ar, assignment) {
  const zip = new JSZip();
  let count = 0;
  const zipFilename = assignment.student + "-assignment.zip";
  console.log(ar, typeof ar);

  for (let [key, value] of Object.entries(ar)) {
    let url = value;
    console.log(url);
    const file = await JSZipUtils.getBinaryContent(url);
    // const ext=getExtension(url)
    // console.log(ext)
    const filename = key + "." + get_url_extension(url);
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

export default AllAssignment;
