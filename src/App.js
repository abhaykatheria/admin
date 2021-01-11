import React, { useState, useEffect } from "react";
import Front from "./screens/index";
import AddTutor from "./screens/AddTutor";
import AddAssignment from "./screens/AddAssignment";
import ViewTutor from "./screens/ViewTutor";
import Analytics from "./screens/Analytics";
import AppBar from "./screens/AppBar";
import AddStudent from "./screens/AddStudent";
import DisplayIndividual from "./screens/DisplayIndividual";
import "filepond/dist/filepond.min.css";
import AllAssignment from "./screens/AllAssignment";
import AddTimedAssignment from "./screens/AddTimedAssignment";
import Display from "./screens/Display";
import "fontsource-roboto";
import TimedAssignment from "./screens/TimedAssignment";
import PaymentCollection from "./screens/PaymentCollection";
import Dues from "./screens/Dues";
import ViewDetails from "./screens/ViewDetails";
import EditTutor from "./screens/EditTutor";
import ViewStudent from "./screens/ViewStudent";
import EditStudent from "./screens/EditStudent";
import EditTimedAssignment from "./screens/EditTimedAssignment";
import EditAssignment from "./screens/EditAssignment";
import DuesData from "./screens/DuesData";
import PaymentData from "./screens/PaymentData";
import IndividualDue from "./screens/IndividualDue";
import IndividualPaymentCollection from "./screens/IndividualPaymentCollection";
import DuesTable from "./screens/DuesTable";
import { createBrowserHistory } from "history";
import Login from "./screens/Login";
import firebase from "firebase";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  const browserHistory = createBrowserHistory();
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // if (user.email === "swarnsriv@gmail.com") {
        //   console.log("user signed");
        //   setIsLogin(true);
      } else {
        console.log("user not signed");
      }
      
    });
  });
  return (
    <div>
      {isLogin === false ? (
        <div>
          <Login />
        </div>
      ) : (
        <Router history={browserHistory}>
          <div>
            <AppBar />
            <Switch>
              <Route exact path="/" component={Front} />
              <Route exact path="/addTutor" component={AddTutor} />
              <Route exact path="/viewTutor" component={ViewTutor} />
              <Route exact path="/addAss" component={AddAssignment} />
              <Route exact path="/analytics" component={Analytics} />
              <Route exact path="/addStudent" component={AddStudent} />
              <Route exact path="/allAss" component={AllAssignment} />
              <Route exact path="/dis" component={DisplayIndividual} />
              <Route exact path="/addTimeAss" component={AddTimedAssignment} />
              <Route exact path="/display" component={Display} />
              <Route exact path="/timedAss" component={TimedAssignment} />
              <Route exact path="/payCol" component={PaymentCollection} />
              <Route exact path="/dues" component={Dues} />
              <Route exact path="/duesData" component={DuesData} />
              <Route exact path="/paymentData" component={PaymentData} />
              <Route exact path="/viewDetails" component={ViewDetails} />
              <Route exact path="/editTutor" component={EditTutor} />
              <Route exact path="/editStudent" component={EditStudent} />
              <Route exact path="/viewStudent" component={ViewStudent} />
              <Route exact path="/indiDues" component={IndividualDue} />
              <Route
                exact
                path="/indiPayCol"
                component={IndividualPaymentCollection}
              />
              <Route exact path="/editTimed" component={EditTimedAssignment} />
              <Route exact path="/editAssignment" component={EditAssignment} />
              <Route exact path="/duesTable" component={DuesTable} />
            </Switch>
          </div>
        </Router>
      )}
    </div>
  );
}

export default App;
