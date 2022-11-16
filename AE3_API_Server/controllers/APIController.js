// Created library
const db = require("../config/database");
const { generateAudit, generatePromoteDemoteAudit } = require("../utility/generateAudit");
const { retrieveRnumber, updateRnumber } = require("../utility/runningNumber");
const { checkValid, checkOptionalIsString } = require("../utility/checkValidation");
const { loginUser, checkApplicationExists, retrieveAppPermitCreate, checkTaskInValidState, checkTaskExists, retrieveAppAcronym, retrieveAppPermitDoing } = require("../utility/ae3_api");
const { retrieveCurrentTaskState, retrieveApplicationPermit, retrieveTaskNotes } = require("../utility/promoteDemoteTask");
const { sendEmail, retrieveLeadEmailAndUsername } = require("../utility/sendEmail");
const { Checkgroup } = require("../utility/checkGroup");

// Required library
const e = require("express");
const { request } = require("express");
const { query } = require("../config/database");

// Create task
const createTask = async (req, res, next) => {
  // Retrieving user input
  var username_input = req.body.username;
  var password_input = req.body.password;
  var task_app_acronym_input = req.body.applicationName;
  var task_name_input = req.body.taskName;
  var task_description_input = req.body.taskDescription;

  // Regex
  const passwordPattern = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,10}$/; // Assert a string to have at least
  const acronymPattern = /^[A-Za-z0-9]+$/;
  try {
    // Validation for username & password
    if (checkValid(username_input) === false || checkValid(password_input) === false) {
      return res.send({
        code: "CT01"
      });
    }
    // Ensure username are 45 character or lesser
    if (username_input.length > 45) {
      return res.send({
        code: "CT01"
      });
    }
    // Ensure password send are within regex
    if (!password_input.match(passwordPattern)) {
      return res.send({
        code: "CT01"
      });
    }
    // Login user
    if ((await loginUser(username_input, password_input)) === false) {
      return res.send({
        code: "CT01"
      });
    }

    // Validation for app name
    if (checkValid(task_app_acronym_input) === false || !task_app_acronym_input.match(acronymPattern) || task_app_acronym_input.length > 45) {
      return res.send({
        code: "CT02"
      });
    }

    // Check if application exists
    if ((await checkApplicationExists(task_app_acronym_input)) === false) {
      return res.send({
        code: "CT02"
      });
    }

    // Validation for task name
    if (checkValid(task_name_input) === false || task_name_input.length > 45) {
      return res.send({
        code: "CT03"
      });
    }

    // Check task description is String
    if (checkOptionalIsString(task_description_input) === false) {
      return res.send({
        code: "CT03"
      });
    }

    // permit create group
    var permitCreateGroup = await retrieveAppPermitCreate(task_app_acronym_input);

    // Check if user have permit to create task
    if ((await Checkgroup(username_input, permitCreateGroup)) === false) {
      console.log("Check group for permit create fail");
      return res.send({
        code: "CT01"
      });
    }

    // Setting date
    var createdDate = new Date(Date.now()).toISOString().slice(0, 10);
    // Retrieving rnumber
    var rnumber = (await retrieveRnumber(task_app_acronym_input)) + 1;
    // Generating task_id
    var task_id = String(task_app_acronym_input) + "_" + String(rnumber);

    // Generating audit trail
    var auditMsg = await generateAudit(username_input, "create", "Task are created");

    // Promotion audit trail
    var promoteAuditMsg = await generatePromoteDemoteAudit(username_input, "Task promoted to ->     " + String("OPEN"));

    // Combine both task created and promoted notes
    auditMsg = auditMsg + promoteAuditMsg;

    // Declare state
    var task_state = "open";

    let sql = `INSERT into task
      (task_id, task_name, task_description, task_notes, task_app_acronym, task_state, task_creator, task_owner, task_createdate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [task_id, task_name_input, task_description_input, auditMsg, task_app_acronym_input, task_state, username_input, username_input, createdDate], async (err, results) => {
      if (err) {
        console.log("Error inserting into task");
        console.log(err);
        return res.send({
          code: "CT03"
        });
      } else {
        if ((await updateRnumber(task_app_acronym_input, rnumber)) === true) {
          return res.send({
            code: "CT00",
            task_id: task_id
          });
        } else {
          return res.send({
            code: "CT03"
          });
        }
      }
    });
  } catch (error) {
    // Uncaught exception
    console.log("Uncaught exception");
    console.log(error);
    return res.send({
      code: "CT99"
    });
  }
};

// Get task by state
const getTasksByState = async (req, res, next) => {
  // Retrieving user input
  var username_input = req.body.username;
  var password_input = req.body.password;
  var task_app_acronym_input = req.body.applicationName;
  var task_state_input = req.body.taskState;

  // Regex
  const passwordPattern = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,10}$/; // Assert a string to have at least
  const acronymPattern = /^[A-Za-z0-9]+$/;
  try {
    // Validation for username & password
    if (checkValid(username_input) === false || checkValid(password_input) === false) {
      return res.send({
        code: "GT01"
      });
    }
    // Ensure username are 45 character or lesser
    if (username_input.length > 45) {
      return res.send({
        code: "GT01"
      });
    }
    // Ensure password send are within regex
    if (!password_input.match(passwordPattern)) {
      return res.send({
        code: "GT01"
      });
    }
    // Login user
    if ((await loginUser(username_input, password_input)) === false) {
      return res.send({
        code: "GT01"
      });
    }

    // Validation for app name
    if (checkValid(task_app_acronym_input) === false || !task_app_acronym_input.match(acronymPattern) || task_app_acronym_input.length > 45) {
      return res.send({
        code: "GT02"
      });
    }

    // Check if application exists
    if ((await checkApplicationExists(task_app_acronym_input)) === false) {
      return res.send({
        code: "GT02"
      });
    }

    // Check if task state body field are valid
    if (checkValid(task_state_input) === false) {
      return res.send({
        code: "GT03"
      });
    }

    // Check if task state entered exists e.g. open, create
    if (checkTaskInValidState(task_state_input) === false) {
      return res.send({
        code: "GT03"
      });
    }

    let sql = `SELECT * FROM task WHERE task_app_acronym = ? AND task_state = ?`;

    db.query(sql, [task_app_acronym_input, task_state_input], async (err, results) => {
      if (err) {
        console.log("Error retrieving task");
        console.log(err);
        return res.send({
          code: "GT03"
        });
      } else {
        return res.send({
          code: "GT00",
          tasks: results
        });
      }
    });
    // End of try
  } catch (error) {
    // Uncaught exception
    console.log("Uncaught exception");
    console.log(error);
    return res.send({
      code: "GT99"
    });
  }
};

// Promote task to done & send email
const promoteTask2Done = async (req, res, next) => {
  // Retrieving user input
  var username_input = req.body.username;
  var password_input = req.body.password;
  var task_id_input = req.body.taskID;
  var task_notes_input = req.body.taskNotes;

  // Regex
  const passwordPattern = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,10}$/; // Assert a string to have at least

  try {
    // Validation for username & password
    if (checkValid(username_input) === false || checkValid(password_input) === false) {
      return res.send({
        code: "PT01"
      });
    }
    // Ensure username are 45 character or lesser
    if (username_input.length > 45) {
      return res.send({
        code: "PT01"
      });
    }
    // Ensure password send are within regex
    if (!password_input.match(passwordPattern)) {
      return res.send({
        code: "PT01"
      });
    }
    // Login user
    if ((await loginUser(username_input, password_input)) === false) {
      return res.send({
        code: "PT01"
      });
    }

    // Check task id
    if (checkValid(task_id_input) === false) {
      return res.send({
        code: "PT02"
      });
    }

    // Check task id is less than 45 characters
    if (String(task_id_input).length > 45) {
      return res.send({
        code: "PT02"
      });
    }

    // Check task_id exists
    if ((await checkTaskExists(task_id_input)) === false) {
      return res.send({
        code: "PT02"
      });
    }

    // Check notes is a string
    if (checkOptionalIsString(task_notes_input) === false) {
      return res.send({
        code: "PT02"
      });
    }

    // Retrieve the state of the selected task
    var currentTaskState = await retrieveCurrentTaskState(task_id_input);

    // Check if current task are in doing state
    if (currentTaskState !== "doing") {
      return res.send({
        code: "PT02"
      });
    }

    // Retrieve app acronym based on task id
    var app_acronym = await retrieveAppAcronym(task_id_input);

    // app_acronym = false, return code
    if (app_acronym === false) {
      return res.send({
        code: "PT02"
      });
    }

    // Retrieve permit doing based on app acronym
    var permitDoingGroup = await retrieveAppPermitDoing(app_acronym);

    // Check if current user are allowed to promote task to done
    if ((await Checkgroup(username_input, permitDoingGroup)) === false) {
      return res.send({
        code: "PT01"
      });
    }

    // Promoted state value of the next promotion
    var promotedState = "done";

    // Retrieve current task notes
    var currentAuditMsg = await retrieveTaskNotes(task_id_input);

    // Create audit trail for promoting task
    var auditMsg = generatePromoteDemoteAudit(username_input, "Task promoted to ->     " + String(promotedState.toUpperCase()));

    currentAuditMsg = String(currentAuditMsg) + String(auditMsg);

    if (task_notes_input !== undefined) {
      if (task_notes_input.length > 1 || task_notes_input.trim().length > 1) {
        currentAuditMsg = String(currentAuditMsg) + generateAudit(username_input, promotedState, String("Added Notes: \n" + task_notes_input));
      }
    }

    let sql = `UPDATE task
      SET task_state = ?, task_owner = ?, task_notes = ?
      WHERE task_id = ?`;

    db.query(sql, [promotedState, username_input, currentAuditMsg, task_id_input], async (err, results) => {
      try {
        var leadUser = await retrieveLeadEmailAndUsername("PL");
        var msg = `Dear fellow project leads, \n\n${task_id_input} from ${app_acronym} have been promoted to DONE state \n\nRegards with thanks <3 \n\n System Generated do not reply`;
        console.log("send email");
        sendEmail("System Generated", "systemgenerated@email.com", leadUser, msg);
        // Successful messages
        return res.send({
          code: "PT00"
        });
      } catch (err) {
        console.log("Error promoting task");
        console.log(err);
        return res.send({
          code: "PT02"
        });
      }
    });
    // End of try for main function
  } catch (error) {
    // Uncaught exception
    console.log("Uncaught exception");
    console.log(error);
    return res.send({
      code: "PT99"
    });
  }
};

module.exports = { createTask, getTasksByState, promoteTask2Done };
