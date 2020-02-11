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
import FlashComponent from "./components/ui/flash/Flash";
import WS from "./services/ws.service";

//Global styles
import "./sass/ui/index.sass";
import "react-tabs/style/react-tabs.css";

WS.init();
momentLocalizer();

@inject("routing", "User", "UI", "FlashStore")
@withRouter
@observer
class App extends Component {
  render() {
    const { User, UI, FlashStore } = this.props;
    return (
      <div className="root">
        <MainMenu />
        {FlashStore.items.map(flash => (
          <FlashComponent
            key={flash.id}
            type={flash.type}
            message={flash.message}
            visible={flash.visible}
          />
        ))}
        {UI.loading && <Loader />}
        <Route path={`/dashboard`} component={DashboardPage} />
        <DevTools />
      </div>
    );
  }
}

export default App;
