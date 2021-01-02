import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import app from "firebase/app";
import "firebase/firebase-firestore";
import { CircularProgress } from "@material-ui/core";
import Display from "./Display";

function AllAssignment() {
  const [assignments, setAssignments] = useState();

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

export default AllAssignment;
