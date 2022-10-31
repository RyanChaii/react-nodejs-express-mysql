// Created library
const db = require("../config/database");
const { Checkgroup } = require("../utility/checkGroup");

// Required library
const e = require("express");
const { request } = require("express");

// Retrieve all user
const getAllApplication = (req, res) => {
  let sql = "SELECT * FROM application";

  db.query(sql, (err, results) => {
    if (err) {
      console.log("Error retrieving application");
      res.status(200).send({
        success: false,
        message: "Error retrieving application"
      });
    } else {
      res.status(200).send({
        success: true,
        message: results
      });
    }
  });
};

// Create application
const createApplication = async (req, res, next) => {
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
  VALUES ('${acronym_input}','${description_input}', '${rnumber_input}', '${startdate_input}', '${enddate_input}', '${permitcreate_input}', '${permitopen_input}', '${permittodolist_input}', '${permitdoing_input}', '${permitdone_input}')`;

  db.query(sql, (err, results) => {
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

module.exports = { getAllApplication, createApplication };
