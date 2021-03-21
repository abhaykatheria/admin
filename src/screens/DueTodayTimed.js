import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import firebase from "firebase";
import "firebase/firebase-firestore";
import moment from "moment";
import { CircularProgress } from "@material-ui/core";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TabularDisplay from "./TabularDisplay";
import DetailsRoundedIcon from "@material-ui/icons/DetailsRounded";

function DueTodayTimed() {
  const [assignments, setAssignments] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);
    var dbRef = firebase.firestore().collection("/timed");
    return dbRef.get().then((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));
      const data1 = [];
      for (var i = 0; i < data.length; i++) {
        if (
          moment(data[i].due_date.toDate().toDateString()).format(
            "DD/MM/YYYY"
          ) === moment().format("DD/MM/YYYY") && data[i].satus !== "completed"
        )
        data1.push([
          data[i].student,
          data[i].subject,
          data[i].tutor,
          data[i].price,
          data[i].amount_paid,
          data[i].tutor_fee,
          moment(data[i].due_date.toDate().toDateString()).format("DD/MM/YYYY"),
          moment(data[i].due_date.toDate()).format(
            "hh:mm a"
          ),
          (data[i].duration) + " mins ",
          data[i].satus,
          data[i].id,
          <Link
            to={{
              pathname: "/viewDetails",
              state: {
                data: data[i],
                type: "timed",
                assigned_date: moment(
                    data[i].assigned_date.toDate().toDateString()
                  ).format("DD/MM/YYYY"),
                  due_date: moment(
                    data[i].due_date.toDate().toDateString()
                  ).format("DD/MM/YYYY"),
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

      setAssignments(data1);
    });
  }, []);

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
      assigned_date: "due_date",
      label: "Start Date",
    },
    {
      due_date: "due_date",
      label: "Start Time",
    },
    {
      duration: "duration",
      label: "Duration",
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
      options: {
        sort: false,
        filter: false,
      },
    },
  ];

  return (
    <div className="body">
      {assignments !== undefined ? (
        <TabularDisplay
          title={"Due Today"}
          data={assignments}
          columns={columns}
        />
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

export default DueTodayTimed;
