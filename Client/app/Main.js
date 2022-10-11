import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// My Components
import Header from "./components/Header";
import Login from "./components/Login";
import Footer from "./components/Footer";
import Dashboard from "./components/dashboard";

function Main() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
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
