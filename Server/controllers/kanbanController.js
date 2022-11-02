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

// Edit application
const editApplication = async (req, res, next) => {
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
  SET app_description = '${description_input}', app_startdate = '${startdate_input}',
  app_enddate = '${enddate_input}', app_permit_create = '${permitcreate_input}', 
  app_permit_open = '${permitopen_input}', app_permit_todolist = '${permittodolist_input}', 
  app_permit_doing = '${permitdoing_input}', app_permit_done = '${permitdone_input}'  
  WHERE app_acronym= '${acronym_input}'`;

  db.query(sql, (err, results) => {
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
const createPlan = async (req, res, next) => {
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
      res.status(200).send({
        success: false,
        message: "Error retrieving plan"
      });
    } else {
      res.status(200).send({
        success: true,
        message: results
      });
    }
  });
};

// Edit plan
const editPlan = async (req, res, next) => {
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

module.exports = { getAllApplication, createApplication, editApplication, createPlan, getPlan, editPlan };
