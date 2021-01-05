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

function DisplayTutor(props) {
  const [assignments, setAssignments] = useState();
  const [name,setName] = useState(props.location.state.name);
  console.log(props.location)

  useEffect(() => {
    window.scrollTo(0, 0);
    const db = app.firestore();
    const data1 = [];
    return (
      db
        .collection("assignments")
        .where("tutor", "==", name)
        .onSnapshot((snapshot) => {
          const data = [];
          snapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));
          for (var i = 0; i < data.length; i++) {
            data1.push([
              data[i].student,
              data[i].subject,
              data[i].tutor,
              data[i].price,
              data[i].amount_paid,
              data[i].tutor_fee,
              "General",
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
                  pathname: "/viewDetails",
                  state: {
                    data: data[i],
                    assigned_date: moment(
                    data[i].assigned_date.toDate().toDateString()
                  ).format("DD/MM/YYYY"),
                  due_date: moment(
                    data[i].due_date.toDate().toDateString()
                  ).format("DD/MM/YYYY"),
                    type: "assignments",
                  },
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  children={<DetailsRoundedIcon />}
                ></Button>
              </Link>,
            ]);
          }
        }),
      db
        .collection("timed")
        .where("tutor", "==", name)
        .onSnapshot((snapshot) => {
          const data = [];
          snapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));
          for (var i = 0; i < data.length; i++) {
            data1.push([
              data[i].student,
              data[i].subject,
              data[i].tutor,
              data[i].price,
              data[i].amount_paid,
              data[i].tutor_fee,
              "Timed",
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
                  pathname: "/viewDetails",
                  state: {
                    data: data[i],
                    assigned_date: moment(
                    data[i].assigned_date.toDate().toDateString()
                  ).format("DD/MM/YYYY"),
                  due_date: moment(
                    data[i].due_date.toDate().toDateString()
                  ).format("DD/MM/YYYY"),
                    type: "timed",
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
        })
    );
  }, [name]);

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
      type: "type",
      label: "Type",
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
      label: "Edit",
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
          title={"Details"}
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

export default DisplayTutor;
