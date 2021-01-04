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
          for (var i = 0; i < data.length; i++) {
            data1.push([
              data[i].student,
              data[i].subject,
              data[i].tutor,
              data[i].price,
              data[i].amount_paid,
              data[i].tutor_fee,
              moment(data[i].assigned_date.toDate().toDateString()).format(
                "DD/MM/YYYY"
              ),
              moment(data[i].due_date.toDate().toDateString()).format(
                "DD/MM/YYYY"
              ),
              data[i].satus,
              data[i].id,
              <Link
                to={{
                  pathname: "/test",
                  aboutProps: {
                    data: data[i],
                  },
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  children={<CheckCircleIcon />}
                ></Button>
              </Link>,
            ]);
          }
          setAssignments(data1);
        } else if (props.location.aboutProps.status === "ongoing") {
          for (i = 0; i < data.length; i++) {
            if (data[i].satus === "ongoing") {
              data1.push([
                data[i].student,
                data[i].subject,
                data[i].tutor,
                data[i].price,
                data[i].amount_paid,
                data[i].tutor_fee,
                moment(data[i].assigned_date.toDate().toDateString()).format(
                  "DD/MM/YYYY"
                ),
                moment(data[i].due_date.toDate().toDateString()).format(
                  "DD/MM/YYYY"
                ),
                data[i].satus,
                data[i].id,
                <Link
                  to={{
                    pathname: "/test",
                    aboutProps: {
                      data: data[i],
                    },
                  }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    children={<CheckCircleIcon />}
                  ></Button>
                </Link>,
              ]);
            }
          }
          setAssignments(data1);
        }
      });
  }, [props]);

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
      price: "price",
      label: "Price",
    },
    {
      amount_paid: "amount_paid",
      label: "Amount paid",
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
      satus: "satus",
      label: "Status",
    },
    {
      id: "id",
      options: {
        display: "excluded",
        sort: false,
        filter: false,
      },
    },
    {
      icon: "icon",
      label: "View",
    },
  ];

  return (
    <div className="body">
      {assignments !== undefined ? (
        <TabularDisplay data={assignments} columns={columns} />
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
