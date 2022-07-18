import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import AdminPanel from "./admin";
import Login from "./login";
import { useSelector, useDispatch } from "react-redux";
import { login, message, setRole } from "./redux/reducer";
import axios from "axios";
import { _URL } from "./utils";

function App() {
  const socket = io("https://api.insurextest.link", { reconnect: true });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isUpdateMessage, setIsUpdateMessage] = React.useState(0);
  const user = useSelector((state) => state.user);
  let token = JSON.parse(
    localStorage.getItem("admin-panel-token-insure-x") ?? "{}"
  );

  React.useEffect(() => {
    socket.on("message-send", (msg) => {
      if (msg?.first_name && msg?.second_name && msg?.role) {
        setIsUpdateMessage(isUpdateMessage + 1);
      }
    });
    axios.get(`${_URL}/push/messages`).then((res) => {
      dispatch(
        message(
          res?.data?.messages?.filter(
            (_message) =>
              _message.first_name ||
              _message.second_name ||
              _message.role ||
              _message.appraiser_company_name ||
              _message.ie_number ||
              _message.oao_ie_number
          )
        )
      );
    });
  }, [isUpdateMessage]);

  React.useEffect(() => {
    if (!user?.auth) {
      if (token?.auth) {
        dispatch(login(token?.auth));
        dispatch(setRole(token.role));
      } else navigate("/login");
    }
  }, [user?.auth]);
  return (
    <Routes>
      {user?.auth ? (
        <Route path="/*" element={<AdminPanel />} />
      ) : (
        <Route path="/*" element={<Login />} />
      )}
    </Routes>
  );
}

export default App;
