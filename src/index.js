import React from "react";
import { BrowserRouter } from "react-router-dom";
// import io from "socket.io-client";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "./redux/store";

// const socket = io("http://3.91.9.208/:3002", { reconnect: true });

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
