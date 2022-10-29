import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

// import Drawer
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'

// import Modal
import Modal from 'react-modal';

// Import my own component
import Header from "./Header";
import HeaderAdmin from "./HeaderAdmin";

// Style for modal popup
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

function Dashboard() {
  // Navigation
  const navigate = useNavigate();
  // Check if admin state
  const [isAdmin, setIsAdmin] = useState();
  // Set username state
  const [username, setUsername] = useState();
  // Create application Modal
  const [openCreateAppModal, setOpenCreateAppModal] = useState(false);
  // Create application state
  const [app_acronym, setapp_acronym] = useState("");
  const [app_description, setapp_description] = useState("");
  const [app_rnumber, setapp_rnumber] = useState(0);
  const [app_startdate, setapp_startdate] = useState();
  const [app_enddate, setapp_enddate] = useState();
  const [app_permit_create, setapp_permit_create] = useState("");
  const [app_permit_open, setapp_permit_open] = useState("");
  const [app_permit_todolist, setapp_permit_todolist] = useState("");
  const [app_permit_doing, setapp_permit_doing] = useState("");
  const [app_permit_done, setapp_permit_done] = useState("");


  function openAppModal() {
    setOpenCreateAppModal(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeAppModal() {
    setOpenCreateAppModal(false);
  }

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
              <button className="btn btn-info" onClick={openAppModal} style={{marginBottom: "50px", marginTop: "50px"}}>Create Application  <i className="fa fa-plus" style={{ marginLeft:"10px", fontSize: "20px" }}></i></button>
            <h3><u>Application</u></h3>
            
      </Drawer>
      </div>
      <div className="col-lg-6">
      <h1 >Welcome to TMS!</h1>
      </div>
      </div>

      {/* Modal for create application */}
      <Modal
        isOpen={openCreateAppModal}
        onRequestClose={closeAppModal}
        style={customStyles}
      >
        {/* <button onClick={closeModal}>close</button> */}
        <div>I am a modal</div>
        <form>
          <input />
          <button>tab navigation</button>
          <button>stays</button>
          <button>inside</button>
          <button>the modal</button>
        </form>
      </Modal>
    </div>
  );
}

export default Dashboard;
