// import React from "react";
// import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// My Components
import Header from "./components/Header";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import UserProfile from "./components/UserProfile";
import UserManagement from "./components/UserManagement";
import UserTable from "./components/UserTable";
import PageNotFound from "./components/PageNotFound";

function App() {
  return (
    <div>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/usermanagement" element={<UserManagement />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
