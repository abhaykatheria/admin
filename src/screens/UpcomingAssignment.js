import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import app from "firebase/app";
import "firebase/firebase-firestore";
import moment from "moment";
import { CircularProgress } from "@material-ui/core";
import Display from "./Display";


function UpcomingAssignment() {
  const [assignments, setAssignments] = useState();

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
            moment(data[i].due_date.seconds * 1000).isoWeek(),
            moment(new Date()).isoWeek()
          );
          if (
            moment(data[i].due_date.toDate().toDateString()) >
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
        {assignments !== undefined ? (
          <Display data = {assignments}/>
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
  );
}

export default UpcomingAssignment;
