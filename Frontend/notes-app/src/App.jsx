import { Navigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import UserPage from "./components/UserPage";
import AuthRedirect from "./components/AuthRedirect";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/:userId/notes" element={<UserPage />} />
          <Route path="/" element={<AuthRedirect />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
