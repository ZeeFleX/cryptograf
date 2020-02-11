// Styles
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { createBrowserHistory } from "history";
import { Provider } from "mobx-react";
import { RouterStore, syncHistoryWithStore } from "mobx-react-router";
import { Router } from "react-router";

// Stores
import UI from "./stores/UI.store";
import FlashStore from "./stores/Flash.store";
import User from "./stores/User.store";
import TimeSeries from "./stores/TimeSeries.store";
import TestsStore from "./stores/Tests.store";
import IndicatorsStore from "./stores/Indicators.store";

const browserHistory = createBrowserHistory();
const routing = new RouterStore();

const stores = {
  routing,
  UI,
  User,
  TimeSeries,
  FlashStore,
  TestsStore,
  IndicatorsStore
};

const history = syncHistoryWithStore(browserHistory, routing);

ReactDOM.render(
  <Provider {...stores}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
