import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

import Header from "./Header";
import HeaderAdmin from "./HeaderAdmin";

function UserProfile() {
  // Navigation
  const navigate = useNavigate();
  // Check if admin state
  const [isAdmin, setIsAdmin] = useState();
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // State for view group
  const [viewGroup, setViewGroup] = useState("");

  // Authenticate user
  async function authuser(token, username, group_list) {
    try {
      // Api call to authenticate and check group user
      const response = await Axios.get("http://localhost:3000/authuser", { params: { token: token, username: username, group_list: group_list } });
      // Get if user are valid
      const islogin = response.data.login;
      // Get if user is admin
      const isadmin = response.data.isAdmin;
      // Set admin state
      setIsAdmin(isadmin);

      if (!islogin) {
        console.log(islogin);
        navigate("/");
      }
    } catch (e) {
      console.log(e);
      navigate("/");
    }
  }

  // Handle update profile
  function handleEditProfileSubmit() {
    console.log("edit profile submit");
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
      {isAdmin ? <HeaderAdmin /> : <Header />}
      <div className="container py-md-5">
        <div className="row align-items-center">
          <div className="col-lg-6 py-3 py-md-5">
            <h1 className="display-3">TMS SYSTEM</h1>
            {/* <p className="lead text-muted">Manage your task here</p> */}
          </div>
          <div className="col-lg-6 pl-lg-5 pb-3 py-lg-5">
            <label htmlFor="username" className="text-muted mb-1">
              <large>Username</large>
            </label>
            <form onSubmit={handleEditProfileSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="text-muted mb-1">
                  <small>Email</small>
                </label>
                <input onChange={e => setEmail(e.target.value)} id="email" name="email" className="form-control" type="text" placeholder="Insert state here" autoComplete="off" />
              </div>
              <div className="form-group">
                <label htmlFor="password" className="text-muted mb-1">
                  <small>Password</small>
                </label>
                <input onChange={e => setPassword(e.target.value)} id="password" name="password" className="form-control" type="password" placeholder="Edit your password here" />
              </div>
              <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
                Update Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
