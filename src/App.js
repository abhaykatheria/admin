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
// import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AddStudent from "./screens/AddStudent";
import ViewStudent from "./screens/ViewStudent"
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import AllAssignment from './screens/AllAssignment'

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

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
          <Route exact path="/addStudent" component={AddStudent} />        
          <Route exact path="/allAss" component={AllAssignment} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
