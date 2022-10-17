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
  // State for view username and group
  const [username, setUsername] = useState("");
  const [viewGroup, setViewGroup] = useState("");
  // Form state
  const [email, setEmail] = useState("");
  const [emailLabel, setEmailLabel] = useState("");
  const [password, setPassword] = useState("");
  // Validation state
  const [emailValidation, setEmailValidation] = useState("");
  const [passwordValidation, setPasswordValidation] = useState("");
  // Message state
  const [message, setMessage] = useState("");

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

      if (!islogin || username != decoded_un) {
        sessionStorage.clear();
        navigate("/");
      }
    } catch (e) {
      console.log(e);
      navigate("/");
    }
  }
  // Retrieve profile initial details (use effect)
  async function retrieveProfile(username) {
    try {
      // Api call to retrieve user profile
      const response = await Axios.get("http://localhost:3000/profile", { params: { username: username } });
      const userprofiledetail = response.data.data[0];
      setViewGroup(userprofiledetail.group_list);
      setEmailLabel(userprofiledetail.email);
    } catch (e) {
      console.log(e);
    }
  }

  // Handle update profile
  async function handleEditProfileSubmit(e) {
    e.preventDefault();
    console.log(password);
    console.log(email);
    try {
      const response = await Axios.post("http://localhost:3000/profile/updateprofile", { username, email, password });
      console.log(response.data.data);
      // Setting validation
      setEmailValidation(response.data.data.email_field);
      setPasswordValidation(response.data.data.pw_field);
      setMessage(response.data.data.message);

      if (response.data.data.message == "Profile Updated") {
        setEmailLabel(email);
        setEmail("");
        setPassword("");
        document.getElementById("email").value = "";
      }
    } catch (e) {
      setMessage(e);
      console.log(e);
    }
  }

  useEffect(() => {
    // Set tab title
    document.title = "User Profile";
    // Retrieve user token
    const userlogintoken = sessionStorage.getItem("token");
    // Retrieve username
    const username = sessionStorage.getItem("username");
    // Check group variable
    const group_list = "admin";
    // Async method call for verify user
    authuser(userlogintoken, username, group_list);
    // Display username
    setUsername(username);
    // Async method to retrieve initial profile detail
    retrieveProfile(username);
  }, []);
  return (
    <div>
      {isAdmin ? <HeaderAdmin /> : <Header />}
      <div className="container">
        <div className="col-lg-6 pl-lg-5 pb-3 py-lg-5" style={{ margin: "auto" }}>
          <form onSubmit={handleEditProfileSubmit}>
            {/* Display username */}
            <div className="form-group">
              <label htmlFor="usernameDisplay" className="text-muted mb-1" style={{ display: "inline-block", textAlign: "left", width: "12rem" }}>
                <h5>Username:</h5>
              </label>
              <big>{username}</big>
            </div>
            {/* Display group */}
            <div className="form-group">
              <label htmlFor="groupDisplay" className="text-muted mb-1" style={{ display: "inline-block", textAlign: "left", width: "12rem" }}>
                <h5>Group: </h5>
              </label>
              <big>{viewGroup}</big>
            </div>
            {/* Label for edit your profile */}
            <label htmlFor="editprofile" className="text-muted mb-1" style={{ paddingTop: "20px", paddingBottom: "10px" }}>
              <h5>
                <b style={{ color: "darkgreen" }}>Edit Your Profile</b>
              </h5>
              <label htmlFor="message" className="text-muted mb-1">
                <h6 style={{ color: "green" }}>
                  <b>{message}</b>
                </h6>
              </label>
            </label>
            {/* Form for email */}
            <div className="form-group">
              <label htmlFor="email" className="text-muted mb-1">
                <h6>Email</h6>
              </label>
              <input onChange={e => setEmail(e.target.value)} id="email" name="email" className="form-control" type="text" placeholder={emailLabel} autoComplete="off" />
              <label htmlFor="emailValidation" className="text-muted mb-1">
                <h6 style={{ color: "red" }}>{emailValidation}</h6>
              </label>
            </div>
            {/* Form for password */}
            <div className="form-group">
              <label htmlFor="password" className="text-muted mb-1">
                <h6>Password</h6>
              </label>
              <input onChange={e => setPassword(e.target.value)} id="password" name="password" className="form-control" type="password" placeholder="Edit your password here" />
              <label htmlFor="passwordValidation" className="text-muted mb-1">
                <h6 style={{ color: "red" }}>{passwordValidation}</h6>
              </label>
            </div>
            <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
