import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

import Header from "./Header";
import HeaderAdmin from "./HeaderAdmin";

function Dashboard() {
  // Navigation
  const navigate = useNavigate();
  // Set authentication
  // const [isAuthenticated, setIsAuthenticated] = useState();
  // Check if admin state
  const [isAdmin, setIsAdmin] = useState();

  // Authenticate user
  async function authuser(token, username, group_list) {
    // Api call to authenticate and check group user
    try {
      const response = await Axios.get("http://localhost:3000/authuser", { params: { token: token, username: username, group_list: group_list } });

      // Get if user are valid
      const islogin = response.data.login;
      // Get if user is admin
      const isadmin = response.data.isAdmin;
      // Get decoded jwt code username
      const decoded_un = response.data.data.username;
      // Set admin state
      setIsAdmin(isadmin);

      if (!islogin || username != decoded_un) {
        sessionStorage.clear();
        navigate("/");
      }
    } catch (e) {
      console.log(e);
      navigate("/");
    }
  }

  useEffect(() => {
    // Retrieve user token
    const userlogintoken = sessionStorage.getItem("token");
    // Retrieve username
    const username = sessionStorage.getItem("username");
    // Check group variable
    const group_list = "admin";
    // Async method call for verify user
    authuser(userlogintoken, username, group_list);
  }, []);

  return (
    <div>
      {/* <Header /> */}
      {isAdmin ? <HeaderAdmin /> : <Header />}
      {/* <HeaderAdmin /> */}
      <h1>Welcome to TMS!</h1>
    </div>
  );
  // Check if authenticated
}

export default Dashboard;
