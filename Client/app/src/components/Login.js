import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

function Login() {
  // Navigation
  const navigate = useNavigate();
  // Form Value
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Login Message
  const [message, setMessage] = useState("");

  //Handle login form
  async function handleLoginSubmit(e) {
    e.preventDefault();
    try {
      // API call wif username and password
      const response = await Axios.post("http://localhost:3000/login", { username, password });
      // const response = await Axios.post("http://localhost:3000/login", { username: "helentan", password: "qqwwee1!" });

      if (response.data.success) {
        // Retrieve JWT token from response
        let token = response.data.data.token;

        // Setting JWT token into session storage
        sessionStorage.setItem("token", token);

        // Setting username into session storage
        sessionStorage.setItem("username", username);
        // Valid login, nav to dashboard
        navigate("/dashboard");
      } else {
        console.log(response.data.message);
        setMessage(response.data.message);
      }
    } catch (e) {
      // setMessage(e);
      console.log(e);
      console.log("Error logining user");
    }
  }
  useEffect(() => {
    document.title = "Login";
  }, []);

  return (
    <div className="container py-md-5">
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">TMS SYSTEM</h1>
          {/* <p className="lead text-muted">Manage your task here</p> */}
        </div>

        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleLoginSubmit}>
            <label htmlFor="message" className="text-muted mb-1">
              <h6 style={{ color: "red" }}>{message}</h6>
            </label>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <h6>Username</h6>
              </label>
              <input onChange={e => setUsername(e.target.value)} id="username" name="username" className="form-control" type="text" placeholder="Enter your username" autoComplete="off" required />
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <h6>Password</h6>
              </label>
              <input onChange={e => setPassword(e.target.value)} id="password" name="password" className="form-control" type="password" placeholder="Enter your password" required />
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
