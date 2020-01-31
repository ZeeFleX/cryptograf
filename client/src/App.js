import React, { Component } from "react";
import DevTools from "mobx-react-devtools";
import { inject, observer } from "mobx-react";
import { Route } from "react-router";
import { withRouter } from "react-router-dom";
import momentLocalizer from "react-widgets-moment";

//Components
import DashboardPage from "./components/dashboard/dashboard";
import MainMenu from "./components/Navigation/MainMenu/mainmenu";
import Loader from "./components/ui/loader/Loader";

//Global styles
import "./sass/ui/index.sass";
import "react-tabs/style/react-tabs.css";

momentLocalizer();

@inject("routing", "User", "UI")
@withRouter
@observer
class App extends Component {
  render() {
    const { User, UI } = this.props;
    return (
      <div className="root">
        <MainMenu />
        {UI.loading && <Loader />}
        <Route path={`/`} component={DashboardPage} />
        <DevTools />
      </div>
    );
  }
}

export default App;
