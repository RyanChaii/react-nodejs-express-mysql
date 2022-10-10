import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// My Components
import Header from "./components/Header";
import Login from "./components/Login";
import Footer from "./components/Footer";

function Main() {
  return (
    <>
      <Login />
    </>
  );
}
// <BrowserRouter>
//   <Routes>
//     <Route path="/login" element={<Login />} />
//      <Footer />
//      <Header />
//   </Routes>
// </BrowserRouter>
const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<Main />);

if (module.hot) {
  module.hot.accept();
}
