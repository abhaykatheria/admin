import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import app from "firebase/app";
import "firebase/firebase-firestore";
import { CircularProgress } from "@material-ui/core";
import Display from "./Display";

function DisplayTutor(props) {
  const [assignments, setAssignments] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log(props.location.aboutProps.name);
    const db = app.firestore();
    return db
      .collection("assignments")
      .where("tutor", "==", props.location.aboutProps.name)
      .onSnapshot((snapshot) => {
        const data = [];
        snapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));
        console.log(data);
        const data1 = [];
        if (props.location.aboutProps.status === "all") {
          setAssignments(data);
        } else {
          for (var i = 0; i < data.length; i++) {
            if (data[i].satus === props.location.aboutProps.status)
              data1.push(data[i]);
          }
          setAssignments(data1);
        }
      });
  }, [props]);

  return (
    <div className="body">
      {assignments !== undefined ? (
        <Display data={assignments} />
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

export default DisplayTutor;
