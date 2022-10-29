import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

// import component 👇
import Drawer from 'react-modern-drawer'

//import styles 👇
import 'react-modern-drawer/dist/index.css'

import Header from "./Header";
import HeaderAdmin from "./HeaderAdmin";

function Dashboard() {
  // Navigation
  const navigate = useNavigate();
  // Check if admin state
  const [isAdmin, setIsAdmin] = useState();
  // Set username state
  const [username, setUsername] = useState();

  // Authenticate user
  async function authuser(token, check_is_admin) {
    // Api call to authenticate and check group user
    try {
      const response = await Axios.get("http://localhost:3000/authuser", { params: { token: token, check_is_admin: check_is_admin } });
      // Get if user are valid
      const islogin = response.data.login;
      // Get if user is admin
      const isadmin = response.data.isAdmin;
      // Get decoded jwt code username
      const decoded_username = response.data.username;
      // Set username state
      setUsername(decoded_username);
      // Set admin state
      setIsAdmin(isadmin);

      if (!islogin) {
        sessionStorage.clear();
        navigate("/");
      }
    } catch (e) {
      console.log(e);
      navigate("/");
    }
  }


  useEffect(() => {
    // Set tab title
    document.title = "Dashboard";
    // Retrieve user token
    const userlogintoken = sessionStorage.getItem("token");
    // Check group variable
    const check_is_admin = "admin";
    // Async method call for verify user
    authuser(userlogintoken, check_is_admin);
  }, []);

  return (
    <div>
      {isAdmin ? <HeaderAdmin /> : <Header />}
      <div className="row">
      <div className="col-lg-2" style={{contentAlign: "center",  textAlign: "center"}}>
      <Drawer
              open='true'
              direction='left'
              enableOverlay={false}
              // overlayOpacity='0'
              className='application-drawer'
              style={{backgroundColor : "black", position: "relative", color: "white" }}
            >
              <button className="btn btn-info" style={{marginBottom: "50px"}}>Create Application  <i className="fa fa-plus" style={{ marginLeft:"10px", fontSize: "20px" }}></i></button>
            <h3><u>Application</u></h3>
            
      </Drawer>
      </div>
      <div className="col-lg-6">
      <h1 >Welcome to TMS!</h1>
      </div>

      </div>

      
      

        
        
    
           
    </div>
  );
}

export default Dashboard;
