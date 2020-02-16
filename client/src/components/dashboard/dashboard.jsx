import React, { Component } from "react";
import { Route } from "react-router";
import { observer, inject } from "mobx-react";

//Components
import TestsPage from "./tests/tests.jsx";
import TestsDetailsPage from "./tests/details/details.jsx";

//Styles
import "./dashboard.sass";

@inject("routing", "User", "TimeSeries")
@observer
class DashboardPage extends Component {
  render() {
    return (
      <div className="wrapper">
        <Route
          exact
          path={`${this.props.match.path}/tests`}
          component={TestsPage}
        />
        <Route
          path={`${this.props.match.path}/tests/:testId`}
          component={TestsDetailsPage}
        />
      </div>
    );
  }
}

export default DashboardPage;
