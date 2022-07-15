import { Routes, Route } from "react-router-dom";
import AdminPanel from "./AdminPanel";

function App() {
  return (
    <Routes>
      <Route path="/*" element={<AdminPanel />} />
    </Routes>
  );
}

export default App;
