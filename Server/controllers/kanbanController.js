// Created library
const db = require("../config/database");
const { Checkgroup } = require("../utility/checkGroup");
const { generateAudit } = require("../utility/generateAudit");
const { retrieveRnumber, updateRnumber } = require("../utility/runningNumber");
const { retrieveTask, retrieveTaskWithPlan } = require("../utility/retrieveTask");
const { retrieveCurrentTaskState, retrieveApplicationPermit, retrieveTaskNotes } = require("../utility/promoteDemoteTask");

// Required library
const e = require("express");
const { request } = require("express");
const { query } = require("../config/database");

// Retrieve all user
const getAllApplication = (req, res) => {
    let sql = "SELECT * FROM application";

    db.query(sql, (err, results) => {
        if (err) {
            console.log("Error retrieving application");
            return res.status(200).send({
                success: false,
                message: "Error retrieving application"
            });
        } else {
            return res.status(200).send({
                success: true,
                message: results
            });
        }
    });
};

// Create application
const createApplication = async(req, res, next) => {
    // Retrieving user input
    var acronym_input = req.body.app_acronym;
    var description_input = req.body.app_description;
    var rnumber_input = req.body.app_rnumber;
    var startdate_input = req.body.app_startdate.slice(0, 10);
    var enddate_input = req.body.app_enddate.slice(0, 10);
    var permitcreate_input = req.body.app_permit_create;
    var permitopen_input = req.body.app_permit_open;
    var permittodolist_input = req.body.app_permit_todolist;
    var permitdoing_input = req.body.app_permit_doing;
    var permitdone_input = req.body.app_permit_done;

    // Regex to validate user input
    const acronymPattern = /^[A-Za-z0-9]+$/;
    const rnumberPattern = /^[0-9]+$/;

    // Acronym validation
    if (!acronym_input.match(acronymPattern) || acronym_input.length < 2) {
        return res.status(200).send({
            success: false,
            message: "Acronym require minimum at least 2 characters, no space and special character"
        });
    }

    // R number validation
    if (!rnumber_input.match(rnumberPattern)) {
        return res.status(200).send({
            success: false,
            message: "R number do not allow decimal or any other character"
        });
    }

    let sql = `INSERT into application 
  (app_acronym, app_description, app_rnumber, app_startdate, app_enddate, app_permit_create, app_permit_open, app_permit_todolist, app_permit_doing, app_permit_done)  
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [acronym_input, description_input, rnumber_input, startdate_input, enddate_input, permitcreate_input, permitopen_input, permittodolist_input, permitdoing_input, permitdone_input], (err, results) => {
        try {
            // SQL error messages
            if (err) {
                console.log("Error");
                // console.log(err);
                return res.status(200).send({
                    success: false,
                    message: "Error creating app, ensure no duplicate"
                });
            }
            // Successful messages
            else {
                return res.status(200).send({
                    success: true,
                    message: "Application created successfully"
                });
            }
        } catch (e) {
            if (e.code == "ER_DUP_ENTRY") {
                return res.status(200).send({
                    success: false,
                    message: "No duplicate app allowed"
                });
            } else {
                return res.status(200).send({
                    success: false,
                    message: "Error creating app, try again later"
                });
            }
        }
    });
};

// Edit application
const editApplication = async(req, res, next) => {
    // Retrieving user input
    var acronym_input = req.body.app_acronym;
    var description_input = req.body.app_description;
    var startdate_input = req.body.app_startdate.slice(0, 10);
    var enddate_input = req.body.app_enddate.slice(0, 10);
    var permitcreate_input = req.body.app_permit_create;
    var permitopen_input = req.body.app_permit_open;
    var permittodolist_input = req.body.app_permit_todolist;
    var permitdoing_input = req.body.app_permit_doing;
    var permitdone_input = req.body.app_permit_done;

    let sql = `UPDATE application
  SET app_description = ?, app_startdate = ?,
  app_enddate = ?, app_permit_create = ?,
  app_permit_open = ?, app_permit_todolist = ?,
  app_permit_doing = ?, app_permit_done = ?
  WHERE app_acronym= ?`;

    db.query(sql, [description_input, startdate_input, enddate_input, permitcreate_input, permitopen_input, permittodolist_input, permitdoing_input, permitdone_input, acronym_input], (err, results) => {
        try {
            // SQL error messages
            if (err) {
                console.log("Error");
                console.log(err);
                return res.status(200).send({
                    success: false,
                    message: "Error updating app, please try again later"
                });
            }
            // Successful messages
            else {
                return res.status(200).send({
                    success: true,
                    message: "Application updated successfully"
                });
            }
        } catch (e) {
            return res.status(200).send({
                success: false,
                message: "Error updating app, try again later"
            });
        }
    });
};

// Create plan
const createPlan = async(req, res, next) => {
    // Retrieving user input
    var mvp_name_input = req.body.plan_mvp_name;
    var startdate_input = req.body.plan_startdate.slice(0, 10);
    var enddate_input = req.body.plan_enddate.slice(0, 10);
    var acronym_input = req.body.app_acronym;
    var colorcode_input = req.body.plan_colorcode;

    // Regex to validate user input
    const mvpnamePattern = /^[A-Za-z0-9_.]+$/;

    // Plan MVP validation
    if (!mvp_name_input.match(mvpnamePattern) || mvp_name_input.length < 3) {
        return res.status(200).send({
            success: false,
            message: "Plan name require minimum at least 3 characters, no space and special character. But allow dot and underscore"
        });
    }

    let sql = `INSERT into plan 
  (plan_mvp_name, plan_startdate, plan_enddate, plan_app_acronym, plan_colorcode)  
  VALUES ('${mvp_name_input}','${startdate_input}', '${enddate_input}', '${acronym_input}', '${colorcode_input}')`;

    db.query(sql, (err, results) => {
        try {
            // SQL error messages
            if (err) {
                console.log("Error");
                // console.log(err);
                return res.status(200).send({
                    success: false,
                    message: "Error creating plan, ensure no duplicate plan name in the same application"
                });
            }
            // Successful messages
            else {
                return res.status(200).send({
                    success: true,
                    message: "Plan created successfully"
                });
            }
        } catch (e) {
            if (e.code == "ER_DUP_ENTRY") {
                return res.status(200).send({
                    success: false,
                    message: "No duplicate plan in the same application allowed"
                });
            } else {
                return res.status(200).send({
                    success: false,
                    message: "Error creating plan, try again later"
                });
            }
        }
    });
};

// Retrieve plan according to app
const getPlan = (req, res) => {
    let sql = `SELECT * FROM plan WHERE plan_app_acronym = '${req.query.app_acronym}'`;

    db.query(sql, (err, results) => {
        if (err) {
            console.log("Error retrieving plan");
            return res.status(200).send({
                success: false,
                message: "Error retrieving plan"
            });
        } else {
            return res.status(200).send({
                success: true,
                message: results
            });
        }
    });
};

// Edit plan
const editPlan = async(req, res, next) => {
    // Retrieving user input
    var mvp_name_input = req.body.plan_mvp_name;
    var startdate_input = req.body.plan_startdate.slice(0, 10);
    var enddate_input = req.body.plan_enddate.slice(0, 10);
    var acronym_input = req.body.app_acronym;
    var colorcode_input = req.body.plan_colorcode;

    let sql = `UPDATE plan 
  SET plan_startdate = '${startdate_input}', plan_enddate = '${enddate_input}',
  plan_colorcode = '${colorcode_input}'
  WHERE plan_mvp_name = '${mvp_name_input}' AND plan_app_acronym = '${acronym_input}'`;

    db.query(sql, (err, results) => {
        try {
            // SQL error messages
            if (err) {
                console.log("Error");
                console.log(err);
                return res.status(200).send({
                    success: false,
                    message: "Error updating plan, please try again later"
                });
            }
            // Successful messages
            else {
                return res.status(200).send({
                    success: true,
                    message: "Plan updated successfully"
                });
            }
        } catch (e) {
            return res.status(200).send({
                success: false,
                message: "Error updating plan, try again later"
            });
        }
    });
};

// Create task
const createTask = async(req, res, next) => {
    // Retrieving user input
    var task_name_input = req.body.task_name;
    var task_description_input = req.body.task_description;
    var task_notes_input = req.body.task_notes;
    var task_plan_input = req.body.task_plan;
    var task_app_acronym_input = req.body.task_app_acronym;
    var task_creator_input = req.body.task_creator;
    var task_owners_input = req.body.task_owner;

    // Setting date
    var createdDate = new Date(Date.now()).toISOString().slice(0, 10);
    // Retrieving rnumber
    var rnumber = (await retrieveRnumber(task_app_acronym_input)) + 1;

    // Generating task_id
    var task_id = String(task_app_acronym_input) + "_" + String(rnumber);

    // Check for only space empty string
    if (task_name_input.trim().length === 0) {
        return res.status(200).send({
            success: false,
            message: "Pure spaces are not allowed for task name"
        });
    }
    // Generating audit trail
    var auditMsg = generateAudit(task_creator_input, "open", "Task are created and added into open state");
    // If user added notes
    if (task_notes_input.length > 1 || task_notes_input.trim().length !== 0) {
        auditMsg = auditMsg + "\n" + generateAudit(task_creator_input, "open", task_notes_input);
    }

    // Declare state
    var task_state = "open";

    let sql = `INSERT into task
  (task_id, task_name, task_description, task_notes, task_plan, task_app_acronym, task_state, task_creator, task_owner, task_createdate)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [task_id, task_name_input, task_description_input, auditMsg, task_plan_input, task_app_acronym_input, task_state, task_creator_input, task_owners_input, createdDate], async(err, results) => {
        if (err) {
            console.log(err);
            return res.status(200).send({
                success: false,
                message: "Failed to create task, please contact admin"
            });
        } else {
            if ((await updateRnumber(task_app_acronym_input, rnumber)) === true) {
                return res.status(200).send({
                    success: true,
                    message: "Task created successfully"
                });
            } else {
                return res.status(200).send({
                    success: false,
                    message: "Failed to create task, please contact admin"
                });
            }
        }
    });
};

// Retrieve task and assign color code based on acronym
const getTask = async(req, res) => {
    try {
        var app_acronym_input = req.query.app_acronym;

        var taskWithoutPlan = await retrieveTask(app_acronym_input);
        var taskWithPlan = await retrieveTaskWithPlan(app_acronym_input);

        var taskData = taskWithoutPlan;

        for (var i = 0; i < taskData.length; i++) {
            taskData[i].plan_colorcode = "#";
        }

        for (var i = 0; i < taskData.length; i++) {
            for (var x = 0; x < taskWithPlan.length; x++) {
                if (taskData[i].task_id === taskWithPlan[x].task_id) {
                    taskData[i] = taskWithPlan[x];
                }
            }
        }

        return res.status(200).send({
            success: true,
            message: taskData
        });
    } catch (e) {
        console.log(e);
        return res.status(200).send({
            success: false,
            message: "Error retrieving task"
        });
    }
};

// Update task
const editTask = async(req, res, next) => {
    // Retrieving user input
    var task_id_input = req.body.task_id;
    var task_description_input = req.body.task_description;
    var task_added_notes_input = req.body.task_added_notes;
    var task_notes_input = req.body.task_notes;
    var task_plan_input = req.body.task_plan;
    var username_input = req.body.username;
    var task_state_input = req.body.task_state;

    var selectedPlan = "";
    // Prevent crashing if no plan was selected
    if (task_plan_input !== null) {
        selectedPlan = task_plan_input.value;
    }

    // Create audit trail for updating of user
    var auditMsg = generateAudit(username_input, task_state_input, "Task have been updated");

    // If user added notes
    if (task_added_notes_input.length > 1 || task_added_notes_input.trim().length !== 0) {
        auditMsg = auditMsg + generateAudit(username_input, task_state_input, task_added_notes_input);
    }

    auditMsg = task_notes_input + auditMsg;

    let sql = `UPDATE task 
  SET task_description = ?, task_notes = ?,
  task_plan = ?, task_owner = ?
  WHERE task_id = ?`;

    db.query(sql, [task_description_input, auditMsg, selectedPlan, username_input, task_id_input], (err, results) => {
        try {
            // SQL error messages
            if (err) {
                console.log(err);
                return res.status(200).send({
                    success: false,
                    message: "Error updating task, please try again later"
                });
            }
            // Successful messages
            else {
                return res.status(200).send({
                    success: true,
                    message: "Task updated successfully"
                });
            }
        } catch (e) {
            return res.status(200).send({
                success: false,
                message: "Error updating task, try again later"
            });
        }
    });
};

// Promote task
const promoteTask = async(req, res, next) => {
    // Retrieving user input
    var task_id_input = req.body.task_id;
    var username_input = req.body.username;
    var task_app_acronym_input = req.body.task_app_acronym;

    // Array of possible promotion state
    var taskStateArray = ["open", "todolist", "doing", "done", "close"];

    // Retrieve the state of the selected task
    var currentTaskState = await retrieveCurrentTaskState(task_id_input);

    // Retrieve the index of the current task in the array
    var currentIndexOfTaskState = taskStateArray.indexOf(currentTaskState);

    // Retrieve selected application permission
    var applicationPermit = await retrieveApplicationPermit(task_app_acronym_input);
    var applicationPermitArray = Object.values(applicationPermit);

    // 2nd layer of backend check if user are permited to promote task, by performing checkgroup
    if(await Checkgroup(username_input, applicationPermitArray[currentIndexOfTaskState]) === false){
        return res.status(200).send({
            success: false,
            message: "You are not permited to promote this task"
        });
    }

    // Promoted state value of the next promotion
    var promotedState = taskStateArray[currentIndexOfTaskState+1];

    // Retrieve current task notes
    var currentAuditMsg = await retrieveTaskNotes(task_id_input);

    // Create audit trail for promoting task
    var auditMsg = await generateAudit(username_input, currentTaskState, "Task promoted to ->     " + String(promotedState.toUpperCase()));

    currentAuditMsg = String(currentAuditMsg) + String(auditMsg);

    let sql = `UPDATE task 
    SET task_state = ?, task_owner = ?, task_notes = ?
    WHERE task_id = ?`;

    db.query(sql, [promotedState, username_input, currentAuditMsg, task_id_input], (err, results) => {
        try {
            // Successful messages
            return res.status(200).send({
                success: true,
                message: "Task promoted"
            });
            
        } catch (err) {
            return res.status(200).send({
                success: false,
                message: "Error promoting task, please try again later"
            });
        }
    });
};

// Perform checkgroup, return true or false
const checkPermit = async(req, res) => {
    var username_input = req.query.username;
    var group_name_input = req.query.group_name;

    try {
        var checkgroupresult = await Checkgroup(username_input, group_name_input);
        // var checkgroupresult = await Checkgroup("admin", "admin");

        if (checkgroupresult === true) {
            return res.status(200).send({
                success: true,
                message: true
            });
        } else {
            return res.status(200).send({
                success: true,
                message: false
            });
        }
    } catch (e) {
        console.log(e);
    }
};

module.exports = { getAllApplication, createApplication, editApplication, createPlan, getPlan, editPlan, createTask, getTask, editTask, promoteTask, checkPermit };