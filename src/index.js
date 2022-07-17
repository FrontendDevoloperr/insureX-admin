import React from "react";
import { BrowserRouter } from "react-router-dom";
import io from "socket.io-client";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "./redux/store";

const socket = io("https://api.insurextest.link", { reconnect: true });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Toaster />
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
