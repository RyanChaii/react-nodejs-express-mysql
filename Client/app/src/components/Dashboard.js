import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

// import Drawer
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
// import Modal
import Modal from "react-modal";
// import Date Picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import react select
import Select from "react-select";
// import toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import icon
import { BsFillGearFill } from "react-icons/bs";

// Import my own component
import Header from "./Header";
import HeaderAdmin from "./HeaderAdmin";

// Style for modal popup
const customStyles = {
  content: {
    top: "50%",
    left: "55%",
    right: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    height: "70%",
    backgroundColor: "#C0D8D3"
    // backgroundColor: "#e8edec"
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    backdropFilter: "blur(5px)"
  }
};

Modal.setAppElement("#root");

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
  const [app_startdate, setapp_startdate] = useState("");
  const [app_enddate, setapp_enddate] = useState("");
  const [app_permit_create, setapp_permit_create] = useState("");
  const [app_permit_open, setapp_permit_open] = useState("");
  const [app_permit_todolist, setapp_permit_todolist] = useState("");
  const [app_permit_doing, setapp_permit_doing] = useState("");
  const [app_permit_done, setapp_permit_done] = useState("");
  // Available Group
  const [groupData, setGroupData] = useState("");
  // State for all application
  const [allAppData, setAllAppData] = useState("");
  // Create application Modal
  const [openEditAppModal, setOpenEditAppModal] = useState(false);

  // Reset the state for application
  function resetAppState() {
    setapp_acronym("");
    setapp_description("");
    setapp_rnumber(0);
    setapp_startdate("");
    setapp_enddate("");
    setapp_permit_create("");
    setapp_permit_open("");
    setapp_permit_todolist("");
    setapp_permit_doing("");
    setapp_permit_done("");
  }

  // Modal for open create application
  function openAppModal() {
    resetAppState();
    getAllGroupData();
    setOpenCreateAppModal(true);
    console.log(groupData);
  }

  // Modal for close create application
  function closeAppModal() {
    setOpenCreateAppModal(false);
  }

  // Get group data to display for creation / edit application
  async function getAllGroupData() {
    try {
      const response = await Axios.get("http://localhost:3000/usermanagement/getallgroup");
      // console.log(response.data.message);
      let groupd = response.data.message;
      // Convert group data to value and label format
      var groupDataOptions = groupd.map(group => {
        return { value: group.group_name, label: group.group_name };
      });
      setGroupData(groupDataOptions);
    } catch (e) {
      console.log(e);
    }
  }

  // Create Application
  async function handleCreateApplicationSubmit(e) {
    e.preventDefault();
    try {
      const response = await Axios.post("http://localhost:3000/kanban/createapp", { app_acronym: app_acronym, app_description: app_description, app_rnumber: app_rnumber, app_startdate: app_startdate, app_enddate: app_enddate, app_permit_create: app_permit_create.value, app_permit_open: app_permit_open.value, app_permit_todolist: app_permit_todolist.value, app_permit_doing: app_permit_doing.value, app_permit_done: app_permit_done.value });
      console.log(response.data);

      if (response.data.message == "Application created successfully") {
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000
        });
        // Remove create app state
        resetAppState();
        closeAppModal();
        getAllApplication();
      }
      // Failed to create application
      if (!response.data.success) {
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000
        });
      }
    } catch (e) {
      toast.error("Problem creating app, please ensure no app duplication", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000
      });
    }
  }

  // Get user data to display at table
  async function getAllApplication() {
    try {
      const response = await Axios.get("http://localhost:3000/kanban/getallapp");
      // setAllAppData(response.data.message);
      console.log(response.data.message);
      var retrievedAppData = response.data.message;

      // var drawerAppData = retrievedAppData.map(app => {
      //   return { appName: app.app_acronym, appData: app };
      // });
      setAllAppData(retrievedAppData);
    } catch (e) {
      console.log(e);
    }
  }

  // Open edit application modal
  function openEditAppModalFun(app) {
    console.log(String(app.app_enddate.slice(0, 10)));
    console.log(app.app_rnumber);
    setapp_acronym(app.app_acronym);
    setapp_description(app.app_description);
    setapp_rnumber(app.app_rnumber);
    // setapp_startdate(app.app_startdate);
    // setapp_enddate(String(app.app_enddate.slice(0, 10)));
    setapp_permit_create(app.app_permit_create);
    setapp_permit_open(app.app_permit_open);
    setapp_permit_todolist(app.app_permit_todolist);
    setapp_permit_doing(app.app_permit_doing);
    setapp_permit_done(app.app_permit_done);
    setOpenEditAppModal(true);
  }

  // Modal for close create application
  function closeEditAppModalFun() {
    setOpenEditAppModal(false);
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
    // Retrieve all application data
    getAllApplication();
  }, []);

  return (
    <div>
      {isAdmin ? <HeaderAdmin /> : <Header />}
      <div className="row">
        <div className="col-lg-2" style={{ contentAlign: "center", textAlign: "center" }}>
          <Drawer open={true} direction="left" enableOverlay={false} className="application-drawer" style={{ backgroundColor: "black", position: "relative", color: "white" }}>
            {/* Create app button */}
            <button className="btn btn-info" id="btnCreateApp" onClick={openAppModal} style={{ marginBottom: "50px", marginTop: "50px" }}>
              Create Application <i className="fa fa-plus" style={{ marginLeft: "10px", fontSize: "20px" }}></i>
            </button>
            {/* Create app header */}
            <h3 style={{ marginBottom: "30px" }}>
              <u>Application</u>
            </h3>
            {/* Show all created application*/}
            {allAppData.length !== 0
              ? allAppData.map(app => {
                  return (
                    <div style={{ paddingBottom: "15px" }}>
                      <button className="btn btn-warning btn-block" style={{ width: "80%", backgroundColor: "gold" }}>
                        {app.app_acronym}
                        <BsFillGearFill
                          style={{ marginLeft: "10px", fontSize: "25px", position: "absolute", left: "70%" }}
                          onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            openEditAppModalFun(app);
                            console.log(app.app_acronym);
                          }}
                        />
                      </button>
                    </div>
                  );
                })
              : null}
          </Drawer>
        </div>
        <div className="col-lg-6">
          <h1>Welcome to TMS!</h1>
        </div>
      </div>

      {/* Modal for create application */}
      <Modal isOpen={openCreateAppModal} onRequestClose={closeAppModal} style={customStyles}>
        {/* <button onClick={closeModal}>close</button> */}
        <h2 style={{ paddingBottom: "20px" }}>Create Application Form</h2>
        <form onSubmit={handleCreateApplicationSubmit}>
          {/* App Acronym */}
          <div className="form-group">
            <label htmlFor="app_acronym" className="text-muted mb-1">
              <h5>Acronym</h5>
            </label>
            <input onChange={e => setapp_acronym(e.target.value)} id="create_app_acronym" className="form-control" type="text" placeholder="Enter App acronym" autoComplete="off" required />
          </div>
          {/* App Description */}
          <div className="form-group">
            <label htmlFor="app_description" className="text-muted mb-1">
              <h5>Description</h5>
            </label>
            <textarea onChange={e => setapp_description(e.target.value)} id="create_app_description" className="form-control" type="text" placeholder="Enter App description (optional)" autoComplete="off"></textarea>
          </div>
          {/* App Rnumber */}
          <div className="form-group">
            <label htmlFor="app_rnumber" className="text-muted mb-1">
              <h5>Rnumber</h5>
            </label>
            <input onChange={e => setapp_rnumber(e.target.value)} id="create_app_rnumber" className="form-control" type="number" placeholder="Select running number" autoComplete="off" required min="0" onKeyDown={evt => (evt.key === "." && evt.preventDefault()) || (evt.key === "e" && evt.preventDefault()) || (evt.key === "-" && evt.preventDefault())} />
          </div>
          {/* App Start Date */}
          <div className="form-group">
            <label htmlFor="app_startdate" className="text-muted mb-1">
              <h5>Start Date</h5>
            </label>
            <DatePicker disabled={true} className="form-control" type="date" onChange={date => setapp_startdate(date)} selected={app_startdate} dateFormat="dd-MM-yyyy" required />
          </div>
          {/* App End Date */}
          <div className="form-group">
            <label htmlFor="app_enddate" className="text-muted mb-1">
              <h5>End Date</h5>
            </label>
            <DatePicker className="form-control" onChange={date => setapp_enddate(date)} selected={app_enddate} dateFormat="dd-MM-yyyy" required />
          </div>
          {/* App Permit Create */}
          <div className="form-group">
            <label htmlFor="app_permitcreate" className="text-muted mb-1">
              <h5>App Permit Create</h5>
            </label>
            <Select onChange={e => setapp_permit_create(e)} value={groupData.value} options={groupData} className="basic-multi-select" classNamePrefix="select" />
          </div>
          {/* App Permit Open */}
          <div className="form-group">
            <label htmlFor="app_permitopen" className="text-muted mb-1">
              <h5>App Permit Open</h5>
            </label>
            <Select onChange={e => setapp_permit_open(e)} value={groupData.value} options={groupData} className="basic-multi-select" classNamePrefix="select" />
          </div>
          {/* App Permit ToDoList */}
          <div className="form-group">
            <label htmlFor="app_permittodolist" className="text-muted mb-1">
              <h5>App Permit ToDoList</h5>
            </label>
            <Select onChange={e => setapp_permit_todolist(e)} value={groupData.value} options={groupData} className="basic-multi-select" classNamePrefix="select" />
          </div>
          {/* App Permit Doing */}
          <div className="form-group">
            <label htmlFor="app_permitdoing" className="text-muted mb-1">
              <h5>App Permit Doing</h5>
            </label>
            <Select onChange={e => setapp_permit_doing(e)} value={groupData.value} options={groupData} className="basic-multi-select" classNamePrefix="select" />
          </div>
          {/* App Permit Done */}
          <div className="form-group">
            <label htmlFor="app_permitdone" className="text-muted mb-1">
              <h5>App Permit Done</h5>
            </label>
            <Select onChange={e => setapp_permit_done(e)} value={groupData.value} options={groupData} className="basic-multi-select" classNamePrefix="select" />
          </div>
          <button type="submit" className="btn btn-lg btn-success btn-block" style={{ marginTop: "20px" }}>
            Create Application
          </button>
        </form>
      </Modal>

      {/* Modal for edit application */}
      <Modal isOpen={openEditAppModal} onRequestClose={closeEditAppModalFun} style={customStyles}>
        {/* <button onClick={closeModal}>close</button> */}
        <h2 style={{ paddingBottom: "20px" }}>Editing Application</h2>
        <form onSubmit={handleCreateApplicationSubmit}>
          {/* App Acronym */}
          <div className="form-group">
            <label htmlFor="app_acronym" className="text-muted mb-1">
              <h5>
                Acronym: <b style={{ fontSize: "25px", color: "black", marginLeft: "20px" }}>{app_acronym}</b>
              </h5>
            </label>
          </div>
          {/* App Description */}
          <div className="form-group">
            <label htmlFor="app_description" className="text-muted mb-1">
              <h5>Description</h5>
            </label>
            <textarea onChange={e => setapp_description(e.target.value)} id="edit_app_description" className="form-control" type="text" value={app_description} autoComplete="off"></textarea>
          </div>
          {/* App Rnumber */}
          <div className="form-group">
            <label htmlFor="app_rnumber" className="text-muted mb-1">
              <h5>
                Rnumber <b style={{ fontSize: "25px", color: "black", marginLeft: "20px" }}>{app_rnumber}</b>
              </h5>
            </label>
          </div>
          {/* App Start Date */}
          <div className="form-group">
            <label htmlFor="app_startdate" className="text-muted mb-1">
              <h5>Start Date</h5>
            </label>
            <DatePicker className="form-control" onChange={date => setapp_startdate(date)} selected={app_startdate} dateFormat="dd-MM-yyyy" required />
          </div>
          {/* App End Date */}
          <div className="form-group">
            <label htmlFor="app_enddate" className="text-muted mb-1">
              <h5>End Date</h5>
            </label>
            <DatePicker className="form-control" onChange={date => setapp_enddate(date)} selected={app_enddate} dateFormat="dd-MM-yyyy" required />
          </div>
          {/* App Permit Create */}
          <div className="form-group">
            <label htmlFor="app_permitcreate" className="text-muted mb-1">
              <h5>App Permit Create</h5>
            </label>
            <Select onChange={e => setapp_permit_create(e)} value={groupData.value} options={groupData} className="basic-multi-select" classNamePrefix="select" />
          </div>
          {/* App Permit Open */}
          <div className="form-group">
            <label htmlFor="app_permitopen" className="text-muted mb-1">
              <h5>App Permit Open</h5>
            </label>
            <Select onChange={e => setapp_permit_open(e)} value={groupData.value} options={groupData} className="basic-multi-select" classNamePrefix="select" />
          </div>
          {/* App Permit ToDoList */}
          <div className="form-group">
            <label htmlFor="app_permittodolist" className="text-muted mb-1">
              <h5>App Permit ToDoList</h5>
            </label>
            <Select onChange={e => setapp_permit_todolist(e)} value={groupData.value} options={groupData} className="basic-multi-select" classNamePrefix="select" />
          </div>
          {/* App Permit Doing */}
          <div className="form-group">
            <label htmlFor="app_permitdoing" className="text-muted mb-1">
              <h5>App Permit Doing</h5>
            </label>
            <Select onChange={e => setapp_permit_doing(e)} value={groupData.value} options={groupData} className="basic-multi-select" classNamePrefix="select" />
          </div>
          {/* App Permit Done */}
          <div className="form-group">
            <label htmlFor="app_permitdone" className="text-muted mb-1">
              <h5>App Permit Done</h5>
            </label>
            <Select onChange={e => setapp_permit_done(e)} value={groupData.value} options={groupData} className="basic-multi-select" classNamePrefix="select" />
          </div>
          <button type="submit" className="btn btn-lg btn-success btn-block" style={{ marginTop: "20px" }}>
            Create Application
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default Dashboard;

// console.log(app_acronym);
// console.log(app_description);
// console.log(app_rnumber);
// console.log(app_startdate);
// console.log(app_enddate);
// console.log(app_permit_create.value);
// console.log(app_permit_open.value);
// console.log(app_permit_todolist.value);
// console.log(app_permit_doing.value);
// console.log(app_permit_done.value);
{
  /* <i className="fa fa-gear" style={{ marginLeft: "10px", fontSize: "20px", position: "absolute", left: "75%" }}></i> */
}
