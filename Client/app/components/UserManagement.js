import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

// crafted component
import HeaderAdmin from "./HeaderAdmin";
import UserTable from "./UserTable";

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

  // User table data state
  const [userData, setUserData] = useState("");
  const [groupData, setGroupData] = useState("");

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
    console.log(createGroupName);
    try {
      const response = await Axios.post("http://localhost:3000/usermanagement/creategroup", { group_name: createGroupName });

      if (!response.data.success) {
        setCreateGroupNameValidation(response.data.message);
        setCreateGroupNameSuccess("");
      } else {
        setCreateGroupNameValidation("");
        setCreateGroupNameSuccess(response.data.message);
        // Rerender table
        getAllGroupData();
      }
    } catch (e) {
      console.log(e);
    }
  }

  // Show create group
  function showCreateGroup() {
    var creategroupdoc = document.getElementById("create-group-form");
    if (creategroupdoc.style.display == "none") {
      creategroupdoc.style.display = "block";
      // creategroupdoc.style.outline = "1px solid gray";
    } else {
      creategroupdoc.style.display = "none";
    }
  }

  // Show create user
  function showCreateUser() {
    var createuserdoc = document.getElementById("create-user-form");
    if (createuserdoc.style.display == "none") {
      createuserdoc.style.display = "block";
    } else {
      createuserdoc.style.display = "none";
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
        // Rerender table
        getAllUserData();
      }
    } catch (e) {
      console.log(e);
      //   setCreateUserMessage(response.data.message);
    }
  }

  // Get user data to display at table
  async function getAllUserData() {
    try {
      const response = await Axios.get("http://localhost:3000/usermanagement/getalluser");
      setUserData(response.data.message);
    } catch (e) {
      console.log(e);
    }
  }

  // Get group data to display at table
  async function getAllGroupData() {
    try {
      const response = await Axios.get("http://localhost:3000/usermanagement/getallgroup");
      // console.log(response.data.message);
      setGroupData(response.data.message);
    } catch (e) {
      console.log(e);
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
    // Retrieve all user data
    getAllUserData();
    // Retrieve all group data
    getAllGroupData();
  }, []);
  return (
    <div>
      {/* Header */}
      <HeaderAdmin />
      {/* Body */}
      <div className="container py-md-2">
        <div className="'row'">
          {/* View & edit user table */}
          <div className="col-lg-12">
            {/* <h1>Table is here</h1> */}
            {userData === "" || groupData === "" ? null : <UserTable userData={userData} groupData={groupData} />}
          </div>

          {/* Create Group & User form */}
          <div className="col-lg-3">
            {/* Create User Header */}
            <div className="w3-container w3-red">
              <h4 onClick={showCreateUser} style={{ cursor: "pointer" }}>
                Create User
                <i className="fa fa-caret-down" style={{ fontSize: "30px", position: "absolute", right: "30px" }}></i>
              </h4>
            </div>
            <form onSubmit={handleCreateUserSubmit} id="create-user-form" style={{ display: "none" }}>
              <div className="form-group">
                {/* Create group label */}
                <label htmlFor="createuser-message" className="text-muted mb-1">
                  <h6 id="createuserid" style={{ color: "green" }}>
                    <b>{createUserMessage}</b>
                  </h6>
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
                Create
              </button>
            </form>

            {/* Create Group Header */}
            <div className="w3-container w3-teal" style={{ marginTop: "20px" }}>
              <h4 onClick={showCreateGroup} style={{ cursor: "pointer" }}>
                Create Group
                <i className="fa fa-caret-down" style={{ fontSize: "30px", position: "absolute", right: "30px" }}></i>
              </h4>
            </div>
            {/* Create Group Form */}
            <form onSubmit={handleCreateGroupSubmit} id="create-group-form" style={{ display: "none" }}>
              <div className="form-group">
                {/* Success message */}
                <label htmlFor="success-message" className="text-muted mb-1" style={{ paddingTop: "20px" }}>
                  <h6 style={{ color: "green" }}>
                    <b>{createGroupNameSuccess}</b>
                  </h6>
                </label>
                {/* Input & validation message display */}
                <input onChange={e => setCreateGroupName(e.target.value)} id="create-group" name="username" className="form-control" type="text" placeholder="Enter a group name" autoComplete="off" required />
                <label htmlFor="createGroupValidation" className="text-muted mb-1">
                  <h6 style={{ color: "red" }}>{createGroupNameValidation}</h6>
                </label>
              </div>
              {/* Create group button*/}
              <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
                Create
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
