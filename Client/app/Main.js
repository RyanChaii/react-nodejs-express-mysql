import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// My Components
import Header from "./components/Header";
import Login from "./components/Login";
import Dashboard from "./components/dashboard";
import UserProfile from "./components/UserProfile";
import UserManagement from "./components/UserManagement";
import UserTable from "./components/UserTable";

function Main() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/usermanagement" element={<UserManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<Main />);

if (module.hot) {
  module.hot.accept();
}

// function Main() {
//   return (
//     <>
//       <Login />
//     </>
//   );
// }
