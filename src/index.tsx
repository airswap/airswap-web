import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import { Provider } from "react-redux";

import { MatomoProvider, createInstance } from "@datapunt/matomo-tracker-react";

import App from "./App";
import { store } from "./app/store";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

const instance = createInstance({
  urlBase: "https://airswap.matomo.cloud/",
  siteId: 1,
  // userId: 'UID76903202', // optional, default value: `undefined`.
  // trackerUrl: 'https://LINK.TO.DOMAIN/tracking.php', // optional, default value: `${urlBase}matomo.php`
  srcUrl: "https://cdn.matomo.cloud/airswap.matomo.cloud/matomo.js", // optional, default value: `${urlBase}matomo.js`
  disabled: false, // optional, false by default. Makes all tracking calls no-ops if set to true.
  heartBeat: {
    // optional, enabled by default
    active: true, // optional, default value: true
    seconds: 10, // optional, default value: `15
  },
  linkTracking: false, // optional, default value: true
  configurations: {
    // optional, default value: {}
    // any valid matomo configuration, all below are optional
    disableCookies: true,
    setSecureCookie: true,
    setRequestMethod: "POST",
  },
});

Modal.setAppElement("#root");

ReactDOM.render(
  <React.StrictMode>
    <MatomoProvider value={instance}>
      <Provider store={store}>
        <App />
      </Provider>
    </MatomoProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
