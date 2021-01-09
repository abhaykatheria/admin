import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import app from "firebase/app";
import "firebase/firebase-firestore";
import { CircularProgress } from "@material-ui/core";
import moment from "moment";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TabularDisplay from "./TabularDisplay";
import DetailsRoundedIcon from "@material-ui/icons/DetailsRounded";

export default function DuesTable(props) {
  const [dues, setDues] = useState();
  const [id, setId] = useState(props.location.state.id);
  const [fieldName, setFieldName] = useState(props.location.state.fieldName);

  useEffect(() => {
    const data1 = [];
    const db = app.firestore();
    window.scrollTo(0, 0);
    return db
      .collection("dues")
      .where(fieldName, "==", id)
      .onSnapshot((snapshot) => {
        const data = [];
        snapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));
        console.log(data); // <------
        data.sort((a, b) =>
          a.due_date.seconds > b.due_date.seconds
            ? 1
            : b.due_date.seconds > a.due_date.seconds
            ? -1
            : 0
        );
        for (var i = 0; i < data.length; i++) {
          data1.push([
            data[i].student,
            data[i].subject,
            data[i].tutor,
            data[i].tutor_fee,
            moment(data[i].assigned_date.toDate().toDateString()).format(
              "DD/MM/YYYY"
            ),
            moment(data[i].due_date.toDate().toDateString()).format(
              "DD/MM/YYYY"
            ),
            <Link
              to={{
                pathname: "/indiDues",
                state: {
                  fieldName: "assg_id",
                  ass_id: data[i].assg_id,
                },
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                children={<DetailsRoundedIcon />}
              ></Button>
            </Link>,
          ]);
        }
        setDues(data1);
        console.log(data1);
      });
  }, [fieldName, id]);

  const columns = [
    {
      student: "student",
      label: "Student",
    },
    {
      subject: "subject",
      label: "Subject",
    },
    {
      tutor: "tutor",
      label: "Tutor",
    },
    {
      tutor_fee: "tutor_fee",
      label: "Tutor Fee",
    },
    {
      assigned_date: "assigned_date",
      label: "Assigned Date",
    },
    {
      due_date: "due_date",
      label: "Due Date",
    },
    {
      icon: "icon",
      label: "Edit",
      options: {
        sort: false,
        filter: false,
      },
    },
  ];

  return (
    <div className="body">
      {dues !== undefined ? (
        <TabularDisplay title={"Dues"} data={dues} columns={columns} />
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
