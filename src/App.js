import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import AdminPanel from "./admin";
import Login from "./login";
import { useSelector, useDispatch } from "react-redux";
import { login, message, setRole, newMessage } from "./redux/reducer";
import axios from "axios";
import { _URL } from "./utils";
const socket = io("wss://api.insurextest.link", { reconnect: true });

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  let token = JSON.parse(
    localStorage.getItem("admin-panel-token-insure-x") ?? "{}"
  );

  React.useEffect(() => {
    if (user?.auth) {
      socket.on("message-send", (msg) => {
        console.log(msg);
        if (
          user?.role === "superadmin" &&
          msg?.first_name &&
          msg?.second_name &&
          msg?.role &&
          msg?.oao_ie_number &&
          msg?.ie_number
        ) {
          dispatch(newMessage());
          axios
            .get(`${_URL}/push/messages`, {
              headers: {
                Authorization: `Bearer ${
                  JSON.parse(localStorage.getItem("admin-panel-token-insure-x"))
                    .token
                } `,
              },
            })
            .then((res) => {
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
        }
        if (user?.role === "insurance_company" && msg?.ie_number) {
          dispatch(newMessage());
          axios
            .get(`${_URL}/push/messages`, {
              headers: {
                Authorization: `Bearer ${
                  JSON.parse(localStorage.getItem("admin-panel-token-insure-x"))
                    .token
                } `,
              },
            })
            .then((res) => {
              dispatch(
                message(
                  res?.data?.messages?.filter((_message) => _message.ie_number)
                )
              );
            });
        }
        if (user?.role === "appraisal_company" && msg?.oao_ie_number) {
          dispatch(newMessage());
          axios
            .get(`${_URL}/push/messages`, {
              headers: {
                Authorization: `Bearer ${
                  JSON.parse(localStorage.getItem("admin-panel-token-insure-x"))
                    .token
                } `,
              },
            })
            .then((res) => {
              dispatch(
                message(
                  res?.data?.messages?.filter(
                    (_message) => _message.oao_ie_number
                  )
                )
              );
            });
        }
      });
    }
  }, [user?.auth]);
  React.useEffect(() => {
    if (user?.auth) {
      axios
        .get(`${_URL}/push/messages`, {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("admin-panel-token-insure-x"))
                .token
            } `,
          },
        })
        .then((res) => {
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
    }
  }, [user?.auth]);

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
