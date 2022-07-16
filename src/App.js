import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AdminPanel from "./admin";
import Login from "./login";
import { useSelector } from "react-redux";

function App() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  React.useEffect(() => {
    if (!user?.auth) {
      navigate("/login");
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
