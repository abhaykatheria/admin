import React from "react";
import { CssBaseline, CircularProgress } from "@material-ui/core";
import Front from "./screens/index";
import AddTutor from "./screens/AddTutor";
import AddAssignment from "./screens/AddAssignment";
import ViewTutor from "./screens/ViewTutor";
import UpcomingAssignment from "./screens/UpcomingAssignment";
import Analytics from "./screens/Analytics";
import AppBar from "./screens/AppBar";
import ViewStudentSearch from "./screens/ViewStudentSearch";
import AddStudent from "./screens/AddStudent";
import DisplayTutor from "./screens/DisplayTutor"
import 'filepond/dist/filepond.min.css';
import AllAssignment from './screens/AllAssignment'
import AddTimedAssignment from './screens/AddTimedAssignment'
import Display from './screens/Display'
import 'fontsource-roboto';
import TimedAssignment from './screens/TimedAssignment'
import PaymentCollection from './screens/PaymentCollection'
import Dues from './screens/Dues'
import ViewDetails from './screens/ViewDetails'
import EditTutor from './screens/EditTutor'
import { createBrowserHistory } from 'history';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  const browserHistory = createBrowserHistory();
  return (
    <Router history={browserHistory}>
      <div>
        <AppBar />
        <Switch>
          <Route exact path="/" component={Front} />
          <Route exact path="/addTutor" component={AddTutor} />
          <Route exact path="/viewTutor" component={ViewTutor} />
          <Route exact path="/addAss" component={AddAssignment} />
          <Route exact path="/upAss" component={UpcomingAssignment} />
          <Route exact path="/analytics" component={Analytics} />
          <Route exact path="/viewStud" component={ViewStudentSearch} />
          <Route exact path="/addStudent" component={AddStudent} />
          <Route exact path="/allAss" component={AllAssignment} />
          <Route exact path="/disTut" component={DisplayTutor} />
          <Route exact path="/addTimeAss" component={AddTimedAssignment} />
          <Route exact path="/display" component={Display}/>
          <Route exact path="/timedAss" component={TimedAssignment} />
          <Route exact path="/payCol" component={PaymentCollection} />
          <Route exact path="/dues" component={Dues} />
          <Route exact path="/viewDetails" component = {ViewDetails} />
          <Route exact path="/editTutor" component = {EditTutor}/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
