// Created library
const db = require("../config/database");
const { Checkgroup } = require("../utility/checkGroup");
const { sendToken } = require("../utility/jwtToken");

// Required library
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const e = require("express");

// bcrypt salt parameter
const saltRounds = 10;

/* Functions */
function getJwtToken(username, admin) {
  return jwt.sign({ username: username, is_admin: admin }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
}

// Get all User = /user
const getUser = (req, res, next) => {
  let sql = "SELECT * FROM user";

  db.query(sql, (err, results) => {
    if (err) {
      res.send("Unable to retrieved results");
    } else {
      res.status(200).send({
        success: true,
        results: results.length,
        requestMethod: req.requestMethod,
        data: results
      });
      console.log(results);
    }
  });
};

// Get login user /login // Regex for injection
const loginUser = (req, res, next) => {
  // User input password
  var pw_input = req.body.password;
  // User input username
  var un_input = req.body.username;

  const onlyLettersPattern = /^[A-Za-z0-9 ]+$/;

  if (!un_input.match(onlyLettersPattern)) {
    return res.status(400).send({ message: "No special characters and no numbers, please!", success: false });
  }

  let sql = `SELECT * FROM user WHERE username = '${un_input}'`;

  db.query(sql, async (err, results) => {
    if (err) {
      res.send("Unable to retrieved results");
    } else {
      // Contains user object
      if (results.length == 1) {
        // Compare user keyed in pw against db
        if ((await bcrypt.compare(pw_input, results[0].password)) == true) {
          // Perform check group
          await Checkgroup(req.body.username, "admin")
            .then(resolve => {
              if (resolve) {
                //Set JWT
                var token = getJwtToken(un_input, true);
                // User login & admin
                res.status(200).send({
                  success: true,
                  requestMethod: req.requestMethod,
                  data: {
                    message: "admin",
                    token: token
                  }
                });
              } else {
                //Set JWT
                var token = getJwtToken(un_input, false);
                // User login & not admin
                res.status(200).send({
                  success: true,
                  data: {
                    message: "notadmin",
                    token: token
                  }
                });
              }
            })
            // Server error
            .catch(reject => {
              console.log("Reject");
              // Internal server error
              res.status(500).send({
                success: false
              });
            });
        }
        // Invalid password input by user
        else {
          res.status(200).send({
            success: true,
            results: results.length,
            requestMethod: req.requestMethod,
            data: "Invalid username or password"
          });
        }
      }
      // User does not exists in the database
      else {
        res.status(200).send({
          success: true,
          results: results.length,
          requestMethod: req.requestMethod,
          data: "Invalid username or password"
        });
      }
    }
  });
};

// Create user
const createUser = async (req, res, next) => {
  // Retrieving user input
  var username_input = req.body.username.toLowerCase();
  var email_input = req.body.email;
  var password_input = req.body.password;

  // Regex to validate user input
  const usernamePattern = /^[A-Za-z0-9]+$/;
  const passwordPattern = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,10}$/; // Assert a string to have at least
  const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

  // Username input validation
  if (!username_input.match(usernamePattern) || username_input.length < 6) {
    return res.status(200).send({
      success: false,
      data: {
        un_field: "Incorrect username format, please have at least 6 characters, no special characters and space allowed",
        pw_field: "",
        email_field: ""
      }
    });
  }

  // Password input validation
  if (!password_input.match(passwordPattern)) {
    return res.status(200).send({
      success: false,
      data: {
        un_field: "",
        pw_field: "Incorrect password format, please have at minimum 8 and maximum 10. Please include at least 1 alphabet, 1 number and 1 special characters",
        email_field: ""
      }
    });
  }

  // Perform user input validation
  if (!email_input.match(emailPattern)) {
    return res.status(200).send({
      success: false,
      data: {
        un_field: "",
        pw_field: "",
        email_field: "Incorrect email format, please enter a valid email"
      }
    });
  }

  // Hashing user input password
  hashpw = await bcrypt.hash(password_input, saltRounds);

  let sql = `INSERT into user (username, email, password, is_active)  VALUES ('${username_input}','${email_input}', '${hashpw}', true)`;

  db.query(sql, (err, results) => {
    // SQL error messages
    if (err) {
      res.status(200).send({
        success: false,
        data: err.code
      });
    }
    // Successful messages
    else {
      res.status(200).send({
        success: true,
        data: "User created"
      });
    }
  });
};

// Retrieve user profile details
const retrieveProfile = (req, res) => {
  let sql = `SELECT * FROM user WHERE username = '${req.body.username}'`;

  db.query(sql, (err, results) => {
    // SQL error messages
    if (err) {
      res.status(200).send({
        success: false,
        data: err.code
      });
    }
    // Successful messages
    else {
      console.log(results);
      if (results.length > 0) {
        res.status(200).send({
          success: true,
          data: results
        });
      }
    }
  });
};

// Update user profile field
const updateProfile = async (req, res) => {
  // Retrieving username (PK) for update
  var username = req.body.username;
  // Retrieving user input
  var email_input = req.body.email;
  var password_input = req.body.password;

  // Regex to validate user input
  const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  const passwordPattern = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,10}$/;

  // Hashed password
  hashpw = await bcrypt.hash(password_input, saltRounds);

  // Empty sql statement
  let sql = "";

  // Empty field was submitted
  if (email_input.length < 1 && password_input.length < 1) {
    return res.status(200).send({
      success: false,
      data: {
        message: "No changes detected"
      }
    });
  }

  // Only email field are edited
  else if (email_input.length > 0 && password_input.length < 1) {
    // Perform user input validation
    if (!email_input.match(emailPattern)) {
      return res.status(200).send({
        success: false,
        data: {
          email_field: "Incorrect email, please make changes",
          pw_field: ""
        }
      });
    }
    // Correct user input, performing email update
    else {
      sql = `UPDATE user SET email = '${email_input}' WHERE username = '${username}'`;
    }
  }

  // Only password field is updated
  else if (email_input.length < 1 && password_input.length > 0) {
    // Perform user input validation
    if (!password_input.match(passwordPattern)) {
      return res.status(200).send({
        success: false,
        data: {
          email_field: "",
          pw_field: "Incorrect password format, please have at minimum 8 and maximum 10. Please include at least 1 alphabet, 1 number and 1 special characters"
        }
      });
    }
    // Correct user input, performing password update
    else {
      sql = `UPDATE user SET password = '${hashpw}' WHERE username = '${username}'`;
    }
  }

  // Both username and password are not empty (update both)
  else {
    // Perform user input validation
    if (!password_input.match(passwordPattern)) {
      return res.status(200).send({
        success: false,
        data: {
          email_field: "",
          pw_field: "Incorrect password format, please have at minimum 8 and maximum 10. Please include at least 1 alphabet, 1 number and 1 special characters"
        }
      });
    } else if (!email_input.match(emailPattern)) {
      return res.status(200).send({
        success: false,
        data: {
          email_field: "Incorrect email, please make changes",
          pw_field: ""
        }
      });
    }
    // Correct user input, performing password update
    else {
      sql = `UPDATE user SET email = '${email_input}', password = '${hashpw}' WHERE username = '${username}'`;
    }
  }

  db.query(sql, (err, results) => {
    // SQL error messages
    if (err) {
      res.status(200).send({
        success: false,
        data: err.code
      });
    }
    // Successful messages
    else {
      // if (results.length > 0) {
      console.log(sql);
      res.status(200).send({
        success: true,
        data: {
          message: "Profile Updated"
        }
      });
      // }
    }
  });
};

// Create group at usermanagement (admin)
const createGroup = (req, res) => {
  // Retrieving admin input
  var groupname_input = req.body.group_name.toLowerCase();

  // Regex to validate user input
  const groupnamePattern = /^[A-Za-z0-9]+$/;

  // Group name input validation
  if (!groupname_input.match(groupnamePattern) || groupname_input.length < 4) {
    return res.status(200).send({
      success: false,
      data: "Incorrect group name format, please have at least 3 characters, no special characters and space allowed"
    });
  }

  //  Checking if anyone uses admin
  if (groupname_input.includes("admin")) {
    return res.status(200).send({
      success: false,
      data: "Group name is not allowed"
    });
  }

  let sql = `INSERT into usergroup (group_name)  VALUES ('${groupname_input}')`;

  db.query(sql, (err, results) => {
    // SQL error messages
    if (err) {
      res.status(200).send({
        success: false,
        data: err.code
      });
    }
    // Successful messages
    else {
      res.status(200).send({
        success: true,
        data: "New group created"
      });
    }
  });
};

module.exports = { getUser, createUser, loginUser, retrieveProfile, updateProfile, createGroup };
