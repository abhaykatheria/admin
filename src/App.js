import React from "react";
import { CssBaseline, CircularProgress } from "@material-ui/core";
import Front from "./screens/index";
import AddTutor from "./screens/AddTutor";
import AddAssignment from "./screens/AddAssignment";
import InProgressAssignment from "./screens/InProgressAssignment";
import ViewTutor from "./screens/ViewTutor";
import DuePast from "./screens/DuePast";
import DoneAssignment from "./screens/DoneAssignment";
import DueToday from "./screens/DueToday";
import UpcomingAssignment from "./screens/UpcomingAssignment";
import Analytics from "./screens/Analytics";
import AppBar from "./screens/AppBar";
import ViewStudentSearch from "./screens/ViewStudentSearch";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <AppBar />
        <Switch>
          <Route exact path="/" component={Front} />
          <Route exact path="/addTutor" component={AddTutor} />
          <Route exact path="/viewTutor" component={ViewTutor} />
          <Route exact path="/doneAss" component={DoneAssignment} />
          <Route exact path="/dueToday" component={DueToday} />
          <Route exact path="/duePast" component={DuePast} />
          <Route exact path="/addAss" component={AddAssignment} />
          <Route exact path="/upAss" component={UpcomingAssignment} />
          <Route exact path="/inProgress" component={InProgressAssignment} />
          <Route exact path="/analytics" component={Analytics} />
          <Route exact path="/viewStud" component={ViewStudentSearch} />          
        </Switch>
      </div>
    </Router>
  );
}

export default App;
