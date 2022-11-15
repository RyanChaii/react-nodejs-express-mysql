// Created library
const db = require("../config/database");
const { generateAudit, generatePromoteDemoteAudit } = require("../utility/generateAudit");
const { retrieveRnumber, updateRnumber } = require("../utility/runningNumber");
const { checkValid, checkOptionalIsString } = require("../utility/checkValidation");
const { loginUser, checkApplicationExists, retrieveAppPermitCreate } = require("../utility/ae3_api");
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

module.exports = { createTask };
