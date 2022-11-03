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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import icon
import { BsFillGearFill, BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";
// import card for kanban
import { CRow, CCol, CCard, CCardBody, CCardTitle, CCardText, CButton, CCardHeader } from "@coreui/react";
// import color picker
import { SliderPicker } from "react-color";

// Import my own component
import Header from "./Header";
import HeaderAdmin from "./HeaderAdmin";

// Style for create app modal popup
const customStylesCreateApp = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    height: "90%",
    backgroundColor: "#90E3E3"
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
// Style for edit App popup
const customStylesEditApp = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    height: "90%",
    backgroundColor: "#E4EDB3"
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
// Style for create plan popup
const customStylesCreatePlan = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    height: "90%",
    backgroundColor: "#B6AFE5"
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

// Style for edit Plan popup
const customStylesEditPlan = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    height: "90%",
    backgroundColor: "#E0E0E7"
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

// Style for create task popup
const customStylesCreateTask = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    height: "90%",
    backgroundColor: "#B5EDB3"
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
  // Main application state (used for task & plan) state
  const [main_app_acronym, set_main_app_acronym] = useState("None");
  const [main_app_rnumber, set_main_app_rnumber] = useState("");
  // Create plan Modal
  const [openCreatePlanModal, setOpenCreatePlanModal] = useState(false);
  // Create Plan State
  const [plan_mvp_name, setplan_mvp_name] = useState("");
  const [plan_startdate, setplan_startdate] = useState("");
  const [plan_enddate, setplan_enddate] = useState("");
  const [plan_colorcode, setplan_colorcode] = useState("");
  // Plan based on acronym
  const [planData, setPlanData] = useState("");
  // Edit plan Modal
  const [openEditPlanModal, setOpenEditPlanModal] = useState(false);
  // Create task Modal
  const [openCreateTaskModal, setOpenCreateTaskModal] = useState(false);
  // Create task state
  const [task_id, settask_id] = useState("");
  const [task_name, settask_name] = useState("");
  const [task_description, settask_description] = useState("");
  const [task_notes, settask_notes] = useState("");
  const [task_added_notes, settask_added_notes] = useState("");
  const [task_plan, settask_plan] = useState("");
  const [task_state, settask_state] = useState("");
  const [task_creator, settask_creator] = useState("");
  const [task_owner, settask_owner] = useState("");
  const [task_createdate, settask_createdate] = useState("");

  // Show plan data during task creation
  const [availablePlan, setAvailablePlan] = useState("");
  // Retrieved task state
  const [taskData, setTaskData] = useState("");
  // Create task Modal
  const [openEditTaskModal, setOpenEditTaskModal] = useState(false);

  // Application
  /* --------------------------------------------------------------------------------------------------------------------------------------------------------------- */

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
    var appbtn = document.querySelectorAll(".btn-application");
    appbtn.forEach(btn => {
      btn.classList.add("disabled", true);
    });

    setOpenCreateAppModal(true);
    console.log(groupData);
  }

  // Modal for close create application
  function closeAppModal() {
    setOpenCreateAppModal(false);

    var appbtn = document.querySelectorAll(".btn-application");
    appbtn.forEach(btn => {
      btn.classList.replace("disabled", false);
    });
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
    setapp_acronym(app.app_acronym);
    setapp_description(app.app_description);
    setapp_rnumber(app.app_rnumber);
    // Start and end date (require to convert to date format)
    setapp_startdate(new Date(app.app_startdate));
    setapp_enddate(new Date(app.app_enddate));
    // Retrieve all group date
    getAllGroupData();
    // Set each selected group for each permit
    setapp_permit_create(() => {
      return { value: app.app_permit_create, label: app.app_permit_create };
    });
    setapp_permit_open(() => {
      return { value: app.app_permit_open, label: app.app_permit_open };
    });
    setapp_permit_todolist(() => {
      return { value: app.app_permit_todolist, label: app.app_permit_todolist };
    });
    setapp_permit_doing(() => {
      return { value: app.app_permit_doing, label: app.app_permit_doing };
    });
    setapp_permit_done(() => {
      return { value: app.app_permit_done, label: app.app_permit_done };
    });

    setOpenEditAppModal(true);
  }

  // Modal for close create application
  function closeEditAppModalFun() {
    resetAppState();
    setOpenEditAppModal(false);
  }

  // Edit Application
  async function handleEditApplicationSubmit(e) {
    e.preventDefault();
    try {
      const response = await Axios.post("http://localhost:3000/kanban/editapp", { app_acronym: app_acronym, app_description: app_description, app_startdate: app_startdate, app_enddate: app_enddate, app_permit_create: app_permit_create.value, app_permit_open: app_permit_open.value, app_permit_todolist: app_permit_todolist.value, app_permit_doing: app_permit_doing.value, app_permit_done: app_permit_done.value });
      console.log(response.data);

      if (response.data.message == "Application updated successfully") {
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000
        });
        // Update the application
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
      toast.error("Problem updating app, please ensure all fields are filled correctly", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000
      });
    }
  }

  // Handle application onclick
  async function handleApplicationOnClick(app_acronym) {
    resetAppState();
    setPlanData("");
    getPlan(app_acronym);
  }

  // Plan
  /* --------------------------------------------------------------------------------------------------------------------------------------------------------------- */

  // Modal for open create plan
  function openCreatePlanModalFun() {
    setOpenCreatePlanModal(true);
  }

  // Modal for close create plan
  function closeCreatePlanModalFun() {
    setplan_mvp_name("");
    setplan_startdate("");
    setplan_enddate("");
    setplan_colorcode("");
    setOpenCreatePlanModal(false);
  }

  // Create Plan
  async function handleCreatePlanSubmit(e) {
    e.preventDefault();
    try {
      const response = await Axios.post("http://localhost:3000/kanban/createplan", { plan_mvp_name: plan_mvp_name, plan_startdate: plan_startdate, plan_enddate: plan_enddate, plan_colorcode: plan_colorcode, app_acronym: main_app_acronym });
      //   console.log(response.data);
      if (response.data.message == "Plan created successfully") {
        getPlan(main_app_acronym);
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000
        });
      }
      // Failed to create application
      if (!response.data.success) {
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000
        });
      }
    } catch (e) {
      toast.error("Problem creating plan, please ensure no plan duplication", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000
      });
    }
  }

  // Get Plan based on app_acronym
  async function getPlan(app_acronym) {
    try {
      const response = await Axios.get("http://localhost:3000/kanban/getplan", { params: { app_acronym: app_acronym } });
      // console.log(response.data.message.length);
      if (response.data.message.length > 0) {
        setPlanData(response.data.message);

        // Convert plan data to value and label format (for select ui)
        var planOptions = response.data.message.map(plan => {
          return { value: plan.plan_mvp_name, label: plan.plan_mvp_name };
        });
        setAvailablePlan(planOptions);
      }
    } catch (e) {
      toast.error("Error retrieving plan, please try again later", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000
      });
    }
  }

  // Modal for open edit plan
  function openEditPlanModalFun(plan) {
    setplan_mvp_name(plan.plan_mvp_name);
    setplan_startdate(new Date(plan.plan_startdate));
    setplan_enddate(new Date(plan.plan_enddate));
    setplan_colorcode(plan.plan_colorcode);
    setOpenEditPlanModal(true);
  }

  // Modal for close edit plan
  function closeEditPlanModalFun() {
    setplan_mvp_name("");
    setplan_startdate("");
    setplan_enddate("");
    setplan_colorcode("");
    setOpenEditPlanModal(false);
  }

  // Edit Plan
  async function handleEditPlanSubmit(e) {
    e.preventDefault();
    try {
      const response = await Axios.post("http://localhost:3000/kanban/editplan", { plan_mvp_name: plan_mvp_name, plan_startdate: plan_startdate, plan_enddate: plan_enddate, plan_colorcode: plan_colorcode, app_acronym: main_app_acronym });
      console.log(response.data);
      if (response.data.message == "Plan updated successfully") {
        getPlan(main_app_acronym);
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000
        });
      }
      // Failed to create application
      if (!response.data.success) {
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000
        });
      }
    } catch (e) {
      toast.error("Problem updating plan, please ensure no plan duplication", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000
      });
    }
  }

  // Task
  /* --------------------------------------------------------------------------------------------------------------------------------------------------------------- */

  // Reset state for task
  function resetTaskState() {
    settask_id("");
    settask_name("");
    settask_description("");
    settask_notes("");
    settask_plan("");
    settask_state("");
    settask_createdate("");
    settask_owner("");
    settask_createdate("");
  }

  // Modal for open create task
  function openCreateTaskModalFun() {
    setOpenCreateTaskModal(true);
  }

  // Modal for close create task
  function closeCreateTaskModalFun() {
    setOpenCreateTaskModal(false);
  }

  // Create Task
  async function handleCreateTaskSubmit(e) {
    e.preventDefault();
    try {
      const response = await Axios.post("http://localhost:3000/kanban/createtask", { task_name: task_name, task_description: task_description, task_notes: task_notes, task_app_acronym: main_app_acronym, task_creator: username, task_owner: username });
      console.log(response.data);
      // Task creation successful
      if (response.data.success) {
        console.log(response);
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000
        });
        getTask(main_app_acronym);
      }
      // Failed to create task
      if (!response.data.success) {
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000
        });
      }
    } catch (e) {
      toast.error("Problem creating task, please ensure all field are filled", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000
      });
    }
  }

  // Get Task
  async function getTask(app_acronym) {
    try {
      // Reset state first
      // resetTaskState();
      setTaskData("");
      const response = await Axios.get("http://localhost:3000/kanban/gettask", { params: { app_acronym: app_acronym } });
      var taskMessage = response.data.message;
      if (response.data.message.length > 0) {
        setTaskData(taskMessage);
        for (var i = 0; i < taskMessage.length; i++) {
          console.log(taskMessage[i].task_id);
          if (taskMessage[i].task_id === task_id) {
            settask_notes(taskMessage[i].task_notes);
          }
        }
      }
    } catch (e) {
      toast.error("Error retrieving plan, please try again later", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000
      });
    }
  }

  // Modal for open edit task
  function openEditTaskModalFun(task) {
    settask_id(task.task_id);
    settask_name(task.task_name);
    settask_description(task.task_description);
    // settask_added_notes(task.task_notes);
    settask_notes(task.task_notes);
    settask_plan(() => {
      return { value: task.task_plan, label: task.task_plan };
    });
    settask_state(task.task_state);
    settask_creator(task.task_creator);
    settask_owner(task.task_owner);
    settask_createdate(task.task_createdate);
    setOpenEditTaskModal(true);
  }

  function afterOpenEditTaskModalFun() {
    var noteTextArea = document.getElementById("show_task_notes");
    noteTextArea.scrollTop = noteTextArea.scrollHeight;
  }

  // Modal for close create task
  function closeEditTaskModalFun() {
    resetTaskState();
    setOpenEditTaskModal(false);
  }

  // Handle edit task
  async function handleUpdateTaskSubmit(e) {
    e.preventDefault();
    // e.stopPropagation();
    try {
      const response = await Axios.post("http://localhost:3000/kanban/edittask", { task_id: task_id, task_description: task_description, task_added_notes: task_added_notes, task_notes: task_notes, task_plan: task_plan, username: username, task_state: task_state });
      // Task update successful
      if (response.data.success) {
        console.log(response);
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000
        });
        getTask(main_app_acronym);
        // settask_notes(task_notes);
      }
      // Failed to create task
      if (!response.data.success) {
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000
        });
      }
    } catch (e) {
      console.log(e);
      toast.error("Problem updating task, please ensure all field are filled", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000
      });
    }
  }
  // Authenticate User
  /* --------------------------------------------------------------------------------------------------------------------------------------------------------------- */

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
        {/* Create and manage application */}
        <div className="col-2" style={{ contentAlign: "center", textAlign: "center" }}>
          <Drawer open={true} direction="left" enableOverlay={false} className="application-drawer" style={{ backgroundColor: "black", position: "relative", color: "white", minHeight: "100vh", height: "100%", width: "100%" }}>
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
                      <button
                        className="btn btn-warning btn-block btn-application"
                        style={{ width: "80%", backgroundColor: "gold" }}
                        onClick={e => {
                          e.stopPropagation();
                          e.preventDefault();
                          set_main_app_acronym(app.app_acronym);
                          handleApplicationOnClick(app.app_acronym);
                          getTask(app.app_acronym);
                        }}
                      >
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

        {/* Kan Ban board */}
        <div className="col-lg-8" style={{ paddingLeft: "20px" }}>
          <h1>Welcome to TMS!</h1>
          <h2>Selected Application: {main_app_acronym}</h2>
          <CRow>
            <CCol sm={2} style={{ width: "200px" }}>
              <CCard>
                <CCardHeader>
                  <CCardTitle>
                    <h5>
                      <b>Open</b>
                    </h5>
                  </CCardTitle>
                </CCardHeader>
                <CCardBody>
                  {taskData.length !== 0
                    ? taskData.map(task => {
                        if (task.task_state === "open") {
                          return (
                            <CCard>
                              <CCardHeader>
                                <CCardTitle>
                                  <h6>{task.task_name}</h6>
                                </CCardTitle>
                              </CCardHeader>
                              <CCardBody>
                                <CRow>
                                  <CCol sm={6} style={{ paddingLeft: "20px", marginBottom: "10px" }}>
                                    {" "}
                                    <BsCaretLeftFill style={{ fontSize: "25px", cursor: "pointer" }} />
                                  </CCol>
                                  <CCol sm={6} style={{ paddingLeft: "20px", marginBottom: "10px" }}>
                                    {" "}
                                    <BsCaretRightFill style={{ fontSize: "25px", cursor: "pointer" }} />
                                  </CCol>
                                </CRow>
                                <CRow>ID: {task.task_id}</CRow>
                                <CRow>Owner: {task.task_owner}</CRow>
                                <CRow>
                                  <CButton
                                    className="btn btn-success btn-block"
                                    href="#"
                                    style={{ marginTop: "10px" }}
                                    onClick={e => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      openEditTaskModalFun(task);
                                    }}
                                  >
                                    Edit
                                  </CButton>
                                </CRow>
                              </CCardBody>
                            </CCard>
                          );
                        }
                      })
                    : null}
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm={2} style={{ width: "200px" }}>
              <CCard>
                <CCardHeader>
                  <CCardTitle>To Do List</CCardTitle>
                </CCardHeader>
                <CCardBody>
                  <CCardText>With supporting text below as a natural lead-in to additional content.</CCardText>
                  <CButton href="#">Go somewhere</CButton>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm={2} style={{ width: "200px" }}>
              <CCard>
                <CCardHeader>
                  <CCardTitle>Doing</CCardTitle>
                </CCardHeader>
                <CCardBody>
                  <CCardText>With supporting text below as a natural lead-in to additional content.</CCardText>
                  <CButton href="#">Go somewhere</CButton>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm={2} style={{ width: "200px" }}>
              <CCard>
                <CCardHeader>
                  <CCardTitle>Done</CCardTitle>
                </CCardHeader>
                <CCardBody>
                  <CCardText>With supporting text below as a natural lead-in to additional content.</CCardText>
                  <CButton href="#">Go somewhere</CButton>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm={2} style={{ width: "200px" }}>
              <CCard>
                <CCardHeader>
                  <CCardTitle>Close</CCardTitle>
                </CCardHeader>
                <CCardBody>
                  <CCardText>With supporting text below as a natural lead-in to additional content.</CCardText>
                  <CButton href="#">Go somewhere</CButton>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </div>

        {/* Right Menu, create task, create and manage plan */}
        <div className="col-lg-2" style={{ contentAlign: "center", textAlign: "center" }}>
          <Drawer open={true} direction="right" enableOverlay={false} className="plan-drawer" style={{ backgroundColor: "black", position: "relative", color: "white", minHeight: "100vh", height: "100%", width: "100%" }}>
            <div className="row">
              <div className="col-12">
                {/* Create task button */}
                <button className="btn btn-default" id="btnCreateTask" onClick={openCreateTaskModalFun} style={{ marginBottom: "30px", marginTop: "50px", backgroundColor: "#6ED625" }}>
                  Create Task <i className="fa fa-plus" style={{ marginLeft: "10px", fontSize: "20px" }}></i>
                </button>
              </div>
              <div className="col-12">
                {/* Create task button */}
                <button className="btn btn-default" id="btnCreatePlan" onClick={openCreatePlanModalFun} style={{ marginBottom: "50px", marginTop: "1px", backgroundColor: "#5744CD" }}>
                  Create Plan <i className="fa fa-plus" style={{ marginLeft: "10px", fontSize: "20px" }}></i>
                </button>
              </div>
            </div>

            {/* Create app header */}
            <h3 style={{ marginBottom: "30px" }}>
              <u>Plan</u>
            </h3>
            {/* Show all plan*/}
            <ul>
              {planData.length !== 0
                ? planData.map(plan => {
                    return (
                      <div style={{ paddingBottom: "15px" }}>
                        <li
                          style={{ backgroundColor: plan.plan_colorcode, cursor: "pointer" }}
                          onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            openEditPlanModalFun(plan);
                          }}
                        >
                          {plan.plan_mvp_name}
                        </li>
                      </div>
                    );
                  })
                : null}
            </ul>
          </Drawer>
        </div>
      </div>

      {/* Modal for create application */}
      <Modal isOpen={openCreateAppModal} onRequestClose={closeAppModal} style={customStylesCreateApp}>
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
            <DatePicker className="form-control" type="date" onChange={date => setapp_startdate(date)} selected={app_startdate} dateFormat="dd-MM-yyyy" onKeyDown={e => e.preventDefault()} required />
          </div>
          {/* App End Date */}
          <div className="form-group">
            <label htmlFor="app_enddate" className="text-muted mb-1">
              <h5>End Date</h5>
            </label>
            <DatePicker className="form-control" onChange={date => setapp_enddate(date)} selected={app_enddate} dateFormat="dd-MM-yyyy" onKeyDown={e => e.preventDefault()} required />
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
      <Modal isOpen={openEditAppModal} onRequestClose={closeEditAppModalFun} style={customStylesEditApp}>
        {/* <button onClick={closeModal}>close</button> */}
        <h2 style={{ paddingBottom: "20px" }}>Editing Application</h2>
        <form onSubmit={handleEditApplicationSubmit}>
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
            <DatePicker className="form-control" onChange={date => setapp_startdate(date)} selected={app_startdate} dateFormat="dd-MM-yyyy" onKeyDown={e => e.preventDefault()} required />
          </div>
          {/* App End Date */}
          <div className="form-group">
            <label htmlFor="app_enddate" className="text-muted mb-1">
              <h5>End Date</h5>
            </label>
            <DatePicker className="form-control" onChange={date => setapp_enddate(date)} selected={app_enddate} dateFormat="dd-MM-yyyy" onKeyDown={e => e.preventDefault()} required />
          </div>
          {/* App Permit Create */}
          <div className="form-group">
            <label htmlFor="app_permitcreate" className="text-muted mb-1">
              <h5>App Permit Create</h5>
            </label>
            <Select onChange={e => setapp_permit_create(e)} value={groupData.value} options={groupData} defaultValue={app_permit_create} className="basic-multi-select" classNamePrefix="select" />
          </div>
          {/* App Permit Open */}
          <div className="form-group">
            <label htmlFor="app_permitopen" className="text-muted mb-1">
              <h5>App Permit Open</h5>
            </label>
            <Select onChange={e => setapp_permit_open(e)} value={groupData.value} options={groupData} defaultValue={app_permit_open} className="basic-multi-select" classNamePrefix="select" />
          </div>
          {/* App Permit ToDoList */}
          <div className="form-group">
            <label htmlFor="app_permittodolist" className="text-muted mb-1">
              <h5>App Permit ToDoList</h5>
            </label>
            <Select onChange={e => setapp_permit_todolist(e)} value={groupData.value} options={groupData} defaultValue={app_permit_todolist} className="basic-multi-select" classNamePrefix="select" />
          </div>
          {/* App Permit Doing */}
          <div className="form-group">
            <label htmlFor="app_permitdoing" className="text-muted mb-1">
              <h5>App Permit Doing</h5>
            </label>
            <Select onChange={e => setapp_permit_doing(e)} value={groupData.value} options={groupData} defaultValue={app_permit_doing} className="basic-multi-select" classNamePrefix="select" />
          </div>
          {/* App Permit Done */}
          <div className="form-group">
            <label htmlFor="app_permitdone" className="text-muted mb-1">
              <h5>App Permit Done</h5>
            </label>
            <Select onChange={e => setapp_permit_done(e)} value={groupData.value} options={groupData} defaultValue={app_permit_done} className="basic-multi-select" classNamePrefix="select" />
          </div>
          <button type="submit" className="btn btn-lg btn-success btn-block" style={{ marginTop: "20px" }}>
            Update Application
          </button>
        </form>
      </Modal>

      {/* Modal for create plan */}
      <Modal isOpen={openCreatePlanModal} onRequestClose={closeCreatePlanModalFun} style={customStylesCreatePlan}>
        <h2 style={{ paddingBottom: "20px" }}>Create Plan Form</h2>
        <form onSubmit={handleCreatePlanSubmit}>
          {/* Plan Name */}
          <div className="form-group">
            <label htmlFor="plan_name" className="text-muted mb-1">
              <h5>Plan Name</h5>
            </label>
            <input onChange={e => setplan_mvp_name(e.target.value)} id="create_plan_name" className="form-control" type="text" placeholder="Enter plan name" autoComplete="off" required />
          </div>
          {/* Plan Start Date */}
          <div className="form-group">
            <label htmlFor="plan_startdate" className="text-muted mb-1">
              <h5>Plan Start Date</h5>
            </label>
            <DatePicker className="form-control" type="date" onChange={date => setplan_startdate(date)} selected={plan_startdate} dateFormat="dd-MM-yyyy" onKeyDown={e => e.preventDefault()} required />
          </div>
          {/* Plan End Date */}
          <div className="form-group">
            <label htmlFor="plan_enddate" className="text-muted mb-1">
              <h5>Plan End Date</h5>
            </label>
            <DatePicker className="form-control" type="date" onChange={date => setplan_enddate(date)} selected={plan_enddate} dateFormat="dd-MM-yyyy" onKeyDown={e => e.preventDefault()} required />
          </div>
          {/* Plan Slider Color */}
          <div className="form-group">
            <label htmlFor="plan_colorcode" className="text-muted mb-1">
              <h5>Plan Color Code</h5>
            </label>
            {/* <Select onChange={e => setapp_permit_done(e)} value={groupData.value} options={groupData} className="basic-multi-select" classNamePrefix="select" /> */}
            <SliderPicker onChange={e => setplan_colorcode(e.hex)} color={plan_colorcode} />
          </div>
          <button type="submit" className="btn btn-lg btn-success btn-block" style={{ marginTop: "20px" }}>
            Create Application
          </button>
        </form>
      </Modal>

      {/* Modal for Edit plan */}
      <Modal isOpen={openEditPlanModal} onRequestClose={closeEditPlanModalFun} style={customStylesEditPlan}>
        <h2 style={{ paddingBottom: "20px" }}>Edit Plan</h2>
        <form onSubmit={handleEditPlanSubmit}>
          {/* Plan Name */}
          <div className="form-group">
            <label htmlFor="plan_name" className="text-muted mb-1">
              <h5>
                Plan Name
                <b style={{ fontSize: "25px", color: "black", marginLeft: "20px" }}>{plan_mvp_name}</b>
              </h5>
            </label>
          </div>
          {/* Plan Start Date */}
          <div className="form-group">
            <label htmlFor="plan_startdate" className="text-muted mb-1">
              <h5>Plan Start Date</h5>
            </label>
            <DatePicker className="form-control" type="date" onChange={date => setplan_startdate(date)} selected={plan_startdate} dateFormat="dd-MM-yyyy" onKeyDown={e => e.preventDefault()} required />
          </div>
          {/* Plan End Date */}
          <div className="form-group">
            <label htmlFor="plan_enddate" className="text-muted mb-1">
              <h5>Plan End Date</h5>
            </label>
            <DatePicker className="form-control" type="date" onChange={date => setplan_enddate(date)} selected={plan_enddate} dateFormat="dd-MM-yyyy" onKeyDown={e => e.preventDefault()} required />
          </div>
          {/* Plan Slider Color */}
          <div className="form-group">
            <label htmlFor="plan_colorcode" className="text-muted mb-1">
              <h5>Plan Color Code</h5>
            </label>
            <SliderPicker onChange={e => setplan_colorcode(e.hex)} color={plan_colorcode} />
          </div>
          <button type="submit" className="btn btn-lg btn-success btn-block" style={{ marginTop: "20px" }}>
            Edit Plan
          </button>
        </form>
      </Modal>

      {/* Modal for create task */}
      <Modal isOpen={openCreateTaskModal} onRequestClose={closeCreateTaskModalFun} style={customStylesCreateTask}>
        <h2 style={{ paddingBottom: "20px" }}>Create Task Form</h2>
        <form onSubmit={handleCreateTaskSubmit}>
          {/* Task Name */}
          <div className="form-group">
            <label htmlFor="task_name" className="text-muted mb-1">
              <h5>Task Name</h5>
            </label>
            <input onChange={e => settask_name(e.target.value)} id="create_task_name" className="form-control" type="text" placeholder="Enter task name" autoComplete="off" required />
          </div>
          {/* Task Description */}
          <div className="form-group">
            <label htmlFor="task_description" className="text-muted mb-1">
              <h5>Task Description</h5>
            </label>
            <textarea onChange={e => settask_description(e.target.value)} id="create_task_description" className="form-control" type="text" placeholder="Enter task description (optional)" autoComplete="off"></textarea>
          </div>
          {/* Task Notes */}
          <div className="form-group">
            <label htmlFor="task_notes" className="text-muted mb-1">
              <h5>Task Notes</h5>
            </label>
            <textarea onChange={e => settask_notes(e.target.value)} id="create_task_notes" className="form-control" type="text" placeholder="Enter task notes (optional)" autoComplete="off"></textarea>
          </div>

          <button type="submit" className="btn btn-lg btn-success btn-block" style={{ marginTop: "20px" }}>
            Create Task
          </button>
        </form>
      </Modal>

      {/* Modal for edit task */}
      <Modal isOpen={openEditTaskModal} onRequestClose={closeEditTaskModalFun} onAfterOpen={afterOpenEditTaskModalFun} style={customStylesCreateTask}>
        <h2 style={{ paddingBottom: "20px" }}>{task_name}</h2>
        <form onSubmit={handleUpdateTaskSubmit}>
          {/* Task ID */}
          <div className="form-group">
            <label htmlFor="task_id" className="text-muted mb-1">
              <h5>
                Task ID <b style={{ fontSize: "25px", color: "black", marginLeft: "20px" }}>{task_id}</b>
              </h5>
            </label>
          </div>
          {/* Task Description */}
          <div className="form-group">
            <label htmlFor="task_description" className="text-muted mb-1">
              <h5>Task Description</h5>
            </label>
            <textarea onChange={e => settask_description(e.target.value)} id="edit_task_description" className="form-control" type="text" placeholder="Enter task description (optional)" autoComplete="off" defaultValue={task_description}></textarea>
          </div>
          {/* Task Notes */}
          <div className="form-group">
            <label htmlFor="task_notes" className="text-muted mb-1">
              <h5>Task Notes</h5>
            </label>
            <textarea id="show_task_notes" className="form-control" type="text" placeholder="Enter task notes (optional)" autoComplete="off" value={task_notes} style={{ minHeight: "150px", marginBottom: "10px" }} disabled></textarea>
            <textarea onChange={e => settask_added_notes(e.target.value)} id="edit_task_added_notes" className="form-control" type="text" placeholder="Enter task notes (optional)" autoComplete="off"></textarea>
          </div>
          {/* Task Plan */}
          <div className="form-group">
            <label htmlFor="edit_task_plan" className="text-muted mb-1">
              <h5>Task Plan</h5>
            </label>
            <Select onChange={e => settask_plan(e)} value={availablePlan.value} options={availablePlan} defaultValue={task_plan} className="basic-multi-select" classNamePrefix="select" />
          </div>
          {/* Task Creator */}
          <div className="form-group">
            <label htmlFor="edit_task_creator" className="text-muted mb-1">
              <h5>
                Creator <b style={{ fontSize: "25px", color: "black", marginLeft: "20px" }}>{task_creator}</b>
              </h5>
            </label>
          </div>
          {/* Task Owner */}
          <div className="form-group">
            <label htmlFor="edit_task_owner" className="text-muted mb-1">
              <h5>
                Owner <b style={{ fontSize: "25px", color: "black", marginLeft: "20px" }}>{task_owner}</b>
              </h5>
            </label>
          </div>
          {/* Task Create Date */}
          <div className="form-group">
            <label htmlFor="edit_task_owner" className="text-muted mb-1">
              <h5>
                Created Date <b style={{ fontSize: "25px", color: "black", marginLeft: "20px" }}>{task_createdate.slice(0, 10)}</b>
              </h5>
            </label>
          </div>
          <button type="submit" className="btn btn-lg btn-success btn-block" style={{ marginTop: "20px" }}>
            Update Task
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default Dashboard;

{
  /* Task Plan */
}
{
  /* <div className="form-group">
            <label htmlFor="task_plan" className="text-muted mb-1">
              <h5>Task Plan</h5>
            </label>
            <Select onChange={e => settask_plan(e)} value={availablePlan.value} options={availablePlan} className="basic-multi-select" classNamePrefix="select" />
          </div> */
}
