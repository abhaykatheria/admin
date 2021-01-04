import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import app from "firebase/app";
import "firebase/firebase-firestore";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CanvasJSReact from "../chart/canvasjs.stock.react";

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

function Analytics() {
  const [dailyCollection, setDailyCollection] = useState();
  const [dayWiseCollection, setDayWiseCollection] = useState();
  const [weeklyCollection, setWeeklyCollection] = useState();
  const [monthlyCollection, setMonthlyCollection] = useState();
  const [defaultGraph, setDefaultGraph] = useState(false);
  const [monthlyGraph, setMonthlyGraph] = useState(false);
  const [weeklyGraph, setWeeklyGraph] = useState(false);
  const [dayGraph, setDayGraph] = useState(false);
  const classes = useStyles();
  moment.updateLocale("en", {
    week: {
      dow: 1, // Monday is the first day of the week.
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const db = app.firestore();
    return db
      .collection("assignments")
      .orderBy("assigned_date")
      .onSnapshot((snapshot) => {
        const data = [];
        var datePrice = {};
        var dayPrice = {};
        var weekPrice = {};
        var monthPrice = {};
        const data1 = [];
        const temp = [];
        const temp2 = [];
        const temp3 = [];
        var daysCount = {};
        snapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));
        for (var key in data) {
          var date = moment(data[key].assigned_date.toDate().toDateString());
          console.log(date);
          var weekNumber = moment(date).format("w");
          console.log(weekNumber);
          var weekDay = moment(date)
            .add(weekNumber - 1, "weeks")
            .subtract(7, "days")
            .format("MMM DD");

          if (datePrice[date.format("MMM DD YYYY")] !== undefined) {
            datePrice[date.format("MMM DD YYYY")] += data[key].price;
          } else {
            datePrice[date.format("MMM DD YYYY")] = data[key].price;
          }

          if (dayPrice[date.format("dddd")] !== undefined) {
            dayPrice[date.format("dddd")] += data[key].price;
            daysCount[date.format("dddd")] += 1;
          } else {
            dayPrice[date.format("dddd")] = data[key].price;
            daysCount[date.format("dddd")] = 1;
          }

          if (weekPrice[weekDay] !== undefined) {
            weekPrice[weekDay] += data[key].price;
          } else {
            weekPrice[weekDay] = data[key].price;
          }

          if (monthPrice[date.format("MMM YY")] !== undefined) {
            monthPrice[date.format("MMM YY")] += data[key].price;
          } else {
            monthPrice[date.format("MMM YY")] = data[key].price;
            console.log(date.format("MMM YY"));
          }
        }

        for (var key2 in datePrice) {
          data1.push({ x: new Date(key2), y: datePrice[key2] / 72 });
        }
        for (var key3 in dayPrice) {
          temp.push({
            label: key3,
            y: dayPrice[key3] / (72 * daysCount[key3]),
          });
        }
        for (var key4 in weekPrice) {
          temp2.push({ label: key4, y: weekPrice[key4] / 72 });
        }
        for (var key5 in monthPrice) {
          console.log(key5);
          temp3.push({ label: key5, y: monthPrice[key5] / 72 });
        }
        console.log("day", temp);
        console.log(data1);
        console.log("week", temp2);
        console.log("month", temp3);

        setDailyCollection(data1);
        setDayWiseCollection(temp);
        setWeeklyCollection(temp2);
        setMonthlyCollection(temp3);
      });
  }, []);

  const defaultCollection = {
    theme: "light2",
    title: {
      text: "Daily Collection",
    },
    subtitles: [
      {
        text: "Date-Collection Trend",
      },
    ],
    charts: [
      {
        height: 100,
        axisX: {
          crosshair: {
            enabled: true,
            snapToDataPoint: true,
          },
        },
        axisY: {
          title: "Collection",
          prefix: "$",
          tickLength: 0,
        },
        toolTip: {
          shared: true,
        },
        data: [
          {
            name: "Collection",
            type: "column",
            dataPoints: dailyCollection,
          },
        ],
      },
    ],
    navigator: {
      data: [
        {
          dataPoints: dailyCollection,
        },
      ],
      slider: {
        minimum: new Date("2020-12-01"),
        maximum: new Date(),
      },
    },
  };

  const dayCollection = {
    title: {
      text: "Day Wise Collection Graph",
    },
    axisX: {
      title: "Days",
    },
    axisY: {
      title: "Collection ($)",
      suffix: " $",
    },
    data: [
      {
        // Change type to "doughnut", "line", "splineArea", etc.
        type: "column",
        dataPoints: dayWiseCollection,
      },
    ],
  };

  const weekCollection = {
    title: {
      text: "Weekly Collection Chart",
    },
    axisX: {
      title: "Weeks",
    },
    axisY: {
      title: "Collection ($)",
      suffix: " $",
    },
    data: [
      {
        // Change type to "doughnut", "line", "splineArea", etc.
        type: "column",
        dataPoints: weeklyCollection,
      },
    ],
  };

  const monthCollection = {
    title: {
      text: "Monthly Collection Chart",
    },
    axisX: {
      title: "Months",
    },
    axisY: {
      title: "Collection ($)",
      suffix: " $",
    },
    data: [
      {
        // Change type to "doughnut", "line", "splineArea", etc.
        type: "column",
        dataPoints: monthlyCollection,
      },
    ],
  };
  const containerProps = {
    width: "100%",
    height: "450px",
    margin: "auto",
  };

  const onDefaultClick = () => {
    setDefaultGraph(true);
    setDayGraph(false);
    setWeeklyGraph(false);
    setMonthlyGraph(false);
  };

  const onDayWiseCollectionClick = () => {
    setDefaultGraph(false);
    setDayGraph(true);
    setWeeklyGraph(false);
    setMonthlyGraph(false);
  };

  const onWeeklyCollectionClick = () => {
    setDefaultGraph(false);
    setDayGraph(false);
    setWeeklyGraph(true);
    setMonthlyGraph(false);
  };

  const onMonthlyCollectionClick = () => {
    setDefaultGraph(false);
    setDayGraph(false);
    setWeeklyGraph(false);
    setMonthlyGraph(true);
  };

  return (
    <div>
      <div
        className={classes.root}
        style={{ margin: "0 auto", textAlign: "center" }}
      >
        <Button variant="contained" onClick={onDefaultClick}>
          Default
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onDayWiseCollectionClick}
        >
          Day Wise Collection
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={onWeeklyCollectionClick}
        >
          Weekly Collection
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onMonthlyCollectionClick}
        >
          Monthly Collection
        </Button>
      </div>
      {defaultGraph ? (
        <CanvasJSStockChart
          containerProps={containerProps}
          options={defaultCollection}
        />
      ) : dayGraph ? (
        <CanvasJSChart options={dayCollection} />
      ) : weeklyGraph ? (
        <CanvasJSChart options={weekCollection} />
      ) : monthlyGraph ? (
        <CanvasJSChart options={monthCollection} />
      ) : (
        <div></div>
      )}
    </div>
  );
}
export default Analytics;
