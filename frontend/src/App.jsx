import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Dashboard from "./pages/Dashboard";
import SchoolMarks from "./pages/SchoolMarks";
import CollegeMarks from "./pages/CollegeMarks";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/school" element={<SchoolMarks />} />
      <Route path="/college" element={<CollegeMarks />} />
    </Routes>
  );
}

export default App;
