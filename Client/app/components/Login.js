import React, { useState } from "react";
// import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

function Login() {
  // Navigation
  const navigate = useNavigate();
  // Form Value
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //Handle login form
  async function handleLoginSubmit(e) {
    e.preventDefault();
    try {
      // API call wif username and password
      const response = await Axios.post("http://localhost:3000/login", { username, password });
      // const response = await Axios.post("http://localhost:3000/login", { username: "helentan", password: "qqwwee1!" });

      // Retrieve JWT token from response
      let token = response.data.data.token;

      console.log(response.data.data);

      // Setting JWT token into session storage
      sessionStorage.setItem("token", token);

      // Setting username into session storage
      sessionStorage.setItem("username", username);

      navigate("/dashboard");

      // var item_value = sessionStorage.getItem("token");

      // const response1 = await Axios.get("http://localhost:3000/authuser", { params: { token: token } });
      // console.log(response1);
    } catch (e) {
      console.log("Error logining user");
    }
  }

  return (
    <div className="container py-md-5">
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">TMS SYSTEM</h1>
          {/* <p className="lead text-muted">Manage your task here</p> */}
        </div>

        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input onChange={e => setUsername(e.target.value)} id="username" name="username" className="form-control" type="text" placeholder="Enter your username" autoComplete="off" />
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input onChange={e => setPassword(e.target.value)} id="password" name="password" className="form-control" type="password" placeholder="Enter your password" />
            </div>
            <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
