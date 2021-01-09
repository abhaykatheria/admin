import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import app from "firebase/app";
import "firebase/firebase-firestore";
import { CircularProgress } from "@material-ui/core";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TabularDisplay from "./TabularDisplay";
import DetailsRoundedIcon from "@material-ui/icons/DetailsRounded";
import moment from "moment";
import "./tutor.css";


export default function DuesData(props) {
  const [tutors, setTutors] = useState();

  useEffect(() => {
    const db = app.firestore();
    const data1 = [];
    window.scrollTo(0, 0);
    return db.collection("tutors").onSnapshot((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));
      for (var i = 0; i < data.length; i++) {
        data1.push(
          [data[i].name, data[i].dues,
          <Link
            to={{
              pathname: "/duesTable",
              state: {
                id: data[i].id,
                fieldName: "tutorId",
              },
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              children={<DetailsRoundedIcon />}
            ></Button>
          </Link>])
      }
      console.log(data1); // <------
      setTutors(data1);
    });
  }, []);

  const columns = [
    {
      student: "Tutor",
      label: "Tutor",
    },
    {
      subject: "dues",
      label: "Total Dues",
    },
    {
        icon: "icon",
        label: "View All",
      },
  ];

  return (
    <div className="body">
      {tutors !== undefined ? (
        <TabularDisplay title={"Details"} data={tutors} columns={columns} />
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
