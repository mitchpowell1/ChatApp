import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { App } from "./App";
import { HttpServerInteractor } from "./server/HttpServer";

const serverUrl = "http://localhost";
const port = "8000";
const httpInteractor = new HttpServerInteractor({
  baseUrlString: serverUrl,
  port,
});

// TODO: Evaluate usage of routes, see if it would make sense
// to just hold the state / routing in the App component.
ReactDOM.render(
  <React.StrictMode>
    <App httpInteractor={httpInteractor} />
  </React.StrictMode>,
  document.getElementById("react-root")
);
