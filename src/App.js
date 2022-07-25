import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AdminPanel from "./admin";
import Login from "./login";
import { useSelector, useDispatch } from "react-redux";
import {
  login,
  setRole,
  isInsuranceCompany,
  isAppraisalCompany,
} from "./redux/reducer";
import { _URL } from "./utils";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  let token = JSON.parse(
    localStorage.getItem("admin-panel-token-insure-x") ?? "{}"
  );
console.log("start version 1.0.0");
  React.useEffect(() => {
    if (!user?.auth) {
      if (token?.auth) {
        dispatch(login(token?.auth));
        dispatch(setRole(token?.role));
        dispatch(isInsuranceCompany(token?.insurance_company));
        dispatch(isAppraisalCompany(token?.appraisal_company));
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
