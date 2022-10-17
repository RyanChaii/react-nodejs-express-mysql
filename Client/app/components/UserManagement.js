import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

import HeaderAdmin from "./HeaderAdmin";

function UserManagement() {
  // Navigation
  const navigate = useNavigate();
  // Check if admin state
  const [isAdmin, setIsAdmin] = useState();
  // Create group state
  const [createGroupName, setCreateGroupName] = useState();
  const [createGroupNameValidation, setCreateGroupNameValidation] = useState();
  const [createGroupNameSuccess, setCreateGroupNameSuccess] = useState();
  // Create User state
  const [createUserusername, setCreateUserusername] = useState();
  const [createUserEmail, setCreateUserEmail] = useState();
  const [createUserPassword, setCreateUserPassword] = useState();
  // Create User label state
  const [createUserMessage, setCreateUserMessage] = useState();
  const [createUserUsernameValidation, setCreateUserUsernameValidation] = useState();
  const [createUserEmailValidation, setCreateUserEmailValidation] = useState();
  const [createUserPasswordValidation, setCreateUserPasswordValidation] = useState();

  // Authenticate user
  async function authuser(token, username, group_list) {
    try {
      // Api call to authenticate and check group user
      const response = await Axios.get("http://localhost:3000/authuser", { params: { token: token, username: username, group_list: group_list } });
      // Get if user are valid
      const islogin = response.data.login;
      // Get if user is admin
      const isadmin = response.data.isAdmin;
      // Get decoded jwt code username
      const decoded_un = response.data.data.username;
      // Set admin state
      setIsAdmin(isadmin);

      if (!islogin || username != decoded_un || !isadmin) {
        sessionStorage.clear();
        navigate("/");
      }
    } catch (e) {
      console.log(e);
      navigate("/");
    }
  }

  // Create Group
  async function handleCreateGroupSubmit(e) {
    e.preventDefault();
    try {
      const response = await Axios.post("http://localhost:3000/usermanagement/creategroup", { group_name: createGroupName });
      console.log(response);
      if (!response.data.success) {
        setCreateGroupNameValidation(response.data.message);
        setCreateGroupNameSuccess("");
      } else {
        setCreateGroupNameValidation("");
        setCreateGroupNameSuccess(response.data.message);
      }
    } catch (e) {
      console.log(e);
    }
  }

  // Create User
  async function handleCreateUserSubmit(e) {
    e.preventDefault();
    try {
      const response = await Axios.post("http://localhost:3000/usermanagement/createuser", { username: createUserusername, email: createUserEmail, password: createUserPassword });
      // Failed to create user
      if (!response.data.success) {
        setCreateUserUsernameValidation(response.data.data.un_field);
        setCreateUserEmailValidation(response.data.data.email_field);
        setCreateUserPasswordValidation(response.data.data.pw_field);
        setCreateUserMessage(response.data.data.message);
        document.getElementById("createuserid").style.color = "red";
      }
      // Successfully created new user
      else {
        // Reset user input
        setCreateUserusername("");
        setCreateUserEmail("");
        setCreateUserPassword("");
        // Reset validation
        setCreateUserUsernameValidation("");
        setCreateUserEmailValidation("");
        setCreateUserPasswordValidation("");
        // html document
        document.getElementById("username-register").value = "";
        document.getElementById("email-register").value = "";
        document.getElementById("password-register").value = "";
        // Set success message
        setCreateUserMessage(response.data.data.message);
        document.getElementById("createuserid").style.color = "green";
      }
    } catch (e) {
      console.log(e);
      //   setCreateUserMessage(response.data.message);
    }
  }
  useEffect(() => {
    // Set tab title
    document.title = "User Management";
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
      <HeaderAdmin />
      <div className="container py-md-5">
        <div className="row">
          {/* Create User Form */}
          <div className="col-lg-7">
            <h1>Table is here</h1>
          </div>
          {/* Create Group Form */}
          <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
            <div class="w3-container w3-teal">
              <h3>Header</h3>
            </div>
            <form onSubmit={handleCreateGroupSubmit}>
              <div className="form-group">
                {/* Create group label */}
                <label htmlFor="create-group" className="text-muted mb-1" style={{ paddingTop: "20px" }}>
                  <h5>Create group</h5>
                  {/* Success message */}
                  <label htmlFor="success-message" className="text-muted mb-1">
                    <h6 style={{ color: "green" }}>
                      <b>{createGroupNameSuccess}</b>
                    </h6>
                  </label>
                </label>
                {/* Input & validation message display */}
                <input onChange={e => setCreateGroupName(e.target.value)} id="create-group" name="username" className="form-control" type="text" placeholder="Enter a group name" autoComplete="off" required />
                <label htmlFor="createGroupValidation" className="text-muted mb-1">
                  <h6 style={{ color: "red" }}>{createGroupNameValidation}</h6>
                </label>
              </div>
              {/* Create group button*/}
              <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
                Create Group
              </button>
            </form>

            <form onSubmit={handleCreateUserSubmit}>
              <div className="form-group">
                {/* Create group label */}
                <label htmlFor="createuser" className="text-muted mb-1" style={{ paddingBottom: "5px" }}>
                  <h5>Create User</h5>
                  <label htmlFor="createuser-message" className="text-muted mb-1">
                    <h6 id="createuserid" style={{ color: "green" }}>
                      <b>{createUserMessage}</b>
                    </h6>
                  </label>
                </label>
              </div>
              {/* Username */}
              <div className="form-group">
                <label htmlFor="username-register" className="text-muted mb-1">
                  <h6>Username</h6>
                </label>
                <input onChange={e => setCreateUserusername(e.target.value)} id="username-register" name="username" className="form-control" type="text" placeholder="Pick a username" autoComplete="off" required />
                <label htmlFor="username-registerValidation" className="text-muted mb-1">
                  <h6 style={{ color: "red" }}>{createUserUsernameValidation}</h6>
                </label>
              </div>
              {/* Email */}
              <div className="form-group">
                <label htmlFor="email-register" className="text-muted mb-1">
                  <h6>Email</h6>
                </label>
                <input onChange={e => setCreateUserEmail(e.target.value)} id="email-register" name="email" className="form-control" type="text" placeholder="you@example.com" autoComplete="off" required />
                <label htmlFor="emailregisterValidation" className="text-muted mb-1">
                  <h6 style={{ color: "red" }}>{createUserEmailValidation}</h6>
                </label>
              </div>
              {/* Password */}
              <div className="form-group">
                <label htmlFor="password-register" className="text-muted mb-1">
                  <h6>Password</h6>
                </label>
                <input onChange={e => setCreateUserPassword(e.target.value)} id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" required />
                <label htmlFor="password-registerValidation" className="text-muted mb-1">
                  <h6 style={{ color: "red" }}>{createUserPasswordValidation}</h6>
                </label>
              </div>
              <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
                Create User
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* Main encapsulation div */}
    </div>
  );
}

export default UserManagement;
