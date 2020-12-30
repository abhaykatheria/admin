import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import app from "firebase/app";
import "firebase/firebase-firestore";
import CanvasJSReact from "../chart/canvasjs.react";

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function Analytics() {
  const [dailyCollection, setDailyCollection] = useState();
  //const classes = useStyles();

  useEffect(() => {
    window.scrollTo(0, 0);
    const db = app.firestore();
    return db
      .collection("assignments")
      .orderBy("assigned_date")
      .onSnapshot((snapshot) => {
        const data = [];
        var dict = {};
        const data1 = [];
        snapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));
        for (var key in data) {
          if (
            dict[data[key].assigned_date.toDate().toDateString()] !== undefined
          ) {
            dict[data[key].assigned_date.toDate().toDateString()] +=
              data[key].price;
          } else {
            dict[data[key].assigned_date.toDate().toDateString()] =
              data[key].price;
          }
        }
        for (var key2 in dict) {
          data1.push({ label: key2, y: dict[key2] });
        }
        console.log(data1);
        setDailyCollection(data1);
      });
  }, []);
  const options = {
    title: {
      text: "Basic Column Chart",
    },
    data: [
      {
        // Change type to "doughnut", "line", "splineArea", etc.
        type: "column",
        dataPoints: dailyCollection,
      },
    ],
  };
  return (
    <div>
      <CanvasJSChart
        options={options}
        /* onRef={ref => this.chart = ref} */
      />
    </div>
  );
}

export default Analytics;
