// Created library
const db = require("../config/database");
const { Checkgroup } = require("../utility/checkGroup");
const { sendToken } = require("../utility/jwtToken");

// Required library
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const e = require("express");
const { request } = require("express");

// bcrypt salt parameter
const saltRounds = 10;

/* signing JWT token */
function getJwtToken(username) {
  return jwt.sign({ username: username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
}

// Get login user /login // Regex for injection
const loginUser = (req, res) => {
  // User input password
  var pw_input = req.body.password;
  // User input username
  var un_input = req.body.username;
  // No special characters
  const onlyLettersPattern = /^[A-Za-z0-9 ]+$/;
  // Prevent SQL injection
  if (!un_input.match(onlyLettersPattern)) {
    return res.status(200).send({
      message: "No special characters and no numbers, please!",
      success: false
    });
  }

  let sql = `SELECT * FROM user WHERE username = '${un_input}'`;

  db.query(sql, async (err, results) => {
    if (err) {
      res.send("Unable to retrieved results");
    }
    // DB retrieved object
    else {
      // Contains user object
      if (results.length == 1 && results[0].is_active == true) {
        // Compare user keyed in pw against db
        if ((await bcrypt.compare(pw_input, results[0].password)) == true) {
          // Perform check group
          await Checkgroup(req.body.username, "admin")
            .then(resolve => {
              if (resolve) {
                //Set JWT
                var token = getJwtToken(un_input);
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
                var token = getJwtToken(un_input);
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
          console.log("fail log in");
          res.status(200).send({
            success: false,
            requestMethod: req.requestMethod,
            message: "Invalid username or password"
          });
        }
      }
      // User does not exists in the database
      else {
        console.log("no such user");
        res.status(200).send({
          success: false,
          requestMethod: req.requestMethod,
          message: "Invalid username or password"
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
        email_field: "",
        message: ""
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
        email_field: "Incorrect email format, please enter a valid email",
        message: ""
      }
    });
  }

  // Password input validation
  if (!password_input.match(passwordPattern)) {
    return res.status(200).send({
      success: false,
      data: {
        un_field: "",
        pw_field: "Incorrect password format, please have at minimum 8 and maximum 10 characters. Please include at least 1 alphabet, 1 number and 1 special characters",
        email_field: "",
        message: ""
      }
    });
  }
  // Hashing user input password
  hashpw = await bcrypt.hash(password_input, saltRounds);

  let sql = `INSERT into user (username, email, password, is_active, group_list)  VALUES ('${username_input}','${email_input}', '${hashpw}', true, "")`;

  db.query(sql, (err, results) => {
    try {
      // SQL error messages
      if (err) {
        console.log("Error");
        return res.status(200).send({
          success: false,
          data: {
            un_field: "",
            pw_field: "",
            email_field: "",
            message: "Error adding user, no duplicate allow"
          }
        });
      }
      // Successful messages
      else {
        return res.status(200).send({
          success: true,
          data: {
            un_field: "",
            pw_field: "",
            email_field: "",
            message: "User created successfully"
          }
        });
      }
    } catch (e) {
      if (e.code == "ER_DUP_ENTRY") {
        return res.status(200).send({
          success: false,
          data: {
            un_field: "",
            pw_field: "",
            email_field: "",
            message: "No duplicate user allowed"
          }
        });
      }
      return res.status(200).send({
        success: false,
        data: {
          un_field: "",
          pw_field: "",
          email_field: "",
          message: "Error adding user"
        }
      });
    }
  });
};

// Retrieve user profile details
const retrieveProfile = (req, res) => {
  let sql = `SELECT * FROM user WHERE username = '${req.query.username}'`;

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
      // console.log(results);
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
          pw_field: "Incorrect password format, please have at minimum 8 and maximum 10 characters. Please include at least 1 alphabet, 1 number and 1 special characters"
        }
      });
    }
    // Correct user input, performing password update
    else {
      sql = `UPDATE user SET password = '${hashpw}' WHERE username = '${username}'`;
    }
  }

  // Both email and password are not empty (update both)
  else {
    // Perform user input validation
    if (!password_input.match(passwordPattern)) {
      return res.status(200).send({
        success: false,
        data: {
          email_field: "",
          pw_field: "Incorrect password format, please have at minimum 8 and maximum 10 characters. Please include at least 1 alphabet, 1 number and 1 special characters"
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
      return res.status(200).send({
        success: false,
        data: err.code
      });
    }
    // Successful messages
    else {
      return res.status(200).send({
        success: true,
        data: {
          message: "Profile Updated"
        }
      });
    }
  });
};

// Create group at usermanagement (admin)
const createGroup = (req, res) => {
  // Retrieving admin input
  var groupname_input = req.body.group_name;

  // Regex to validate user input
  const groupnamePattern = /^[A-Za-z0-9]+$/;

  // Group name input validation
  if (!groupname_input.match(groupnamePattern) || groupname_input.length < 2) {
    return res.status(200).send({
      success: false,
      message: "Incorrect group name format, please have at least 2 characters, no special characters and space allowed"
    });
  }

  //  Checking if anyone uses admin
  if (groupname_input.includes("admin")) {
    return res.status(200).send({
      success: false,
      message: "Group name is not allowed"
    });
  }

  let sql = `INSERT into usergroup (group_name)  VALUES ('${groupname_input}')`;

  db.query(sql, (err, results) => {
    try {
      // SQL error messages
      if (err) {
        // Check for duplicate entry
        if (err.code == "ER_DUP_ENTRY") {
          return res.status(200).send({
            success: false,
            message: "No duplicate entry allowed"
          });
        }
        // Send normal error message
        return res.status(200).send({
          success: false,
          message: "Error creating group, try again later"
        });
      }
      // Successful
      else {
        // Successful messages
        return res.status(200).send({
          success: true,
          message: "New group created"
        });
      }
    } catch (e) {
      console.log(e);
      return res.status(200).send({
        success: false,
        message: "Error creating group, try again later"
      });
    }
  });
};

// Retrieve all user
const getAllUser = (req, res) => {
  let sql = "SELECT * FROM user";

  db.query(sql, (err, results) => {
    if (err) {
      res.status(200).send({
        success: false,
        message: err
      });
    } else {
      res.status(200).send({
        success: true,
        message: results
      });
    }
  });
};

// Edit user
const updateUser = async (req, res) => {
  // Retrieving username (PK) for update
  var username = req.body.username;
  // Retrieving user input
  var email_input = req.body.email;
  var password_input = req.body.password;
  var is_active_input = req.body.is_active;
  var group_list_input = req.body.group_list;

  // Regex to validate user input
  const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  const passwordPattern = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,10}$/;

  // Hashed password
  hashpw = await bcrypt.hash(password_input, saltRounds);

  // Empty sql statement
  var sql = "";

  // Only email field are edited
  if (email_input.length > 0 && password_input.length < 1) {
    // Perform user input validation
    if (!email_input.match(emailPattern)) {
      return res.status(200).send({
        success: false,
        message: "Incorrect email, please make changes"
      });
    }
    // data: {
    //   email_field: "Incorrect email, please make changes",
    //   pw_field: ""
    // }
    // Correct user input, performing email update
    else {
      sql = `UPDATE user SET email = '${email_input}', is_active = '${is_active_input}', group_list = '${group_list_input}' WHERE username = '${username}'`;
    }
  }

  // Only password field is updated
  else if (email_input.length < 1 && password_input.length > 0) {
    // Perform user input validation
    if (!password_input.match(passwordPattern)) {
      return res.status(200).send({
        success: false,
        message: "Incorrect password format, please have at minimum 8 and maximum 10. Please include at least 1 alphabet, 1 number and 1 special characters"
      });
    }
    // data: {
    //   email_field: "",
    //   pw_field: "Incorrect password format, please have at minimum 8 and maximum 10. Please include at least 1 alphabet, 1 number and 1 special characters"
    // }
    // Correct user input, performing password update
    else {
      sql = `UPDATE user SET password = '${hashpw}', is_active = '${is_active_input}', group_list = '${group_list_input}' WHERE username = '${username}'`;
    }
  }

  // Both username and password are not empty (update both)
  else {
    // Perform user input validation
    if (!password_input.match(passwordPattern)) {
      return res.status(200).send({
        success: false,
        message: "Incorrect password format, please have at minimum 8 and maximum 10. Please include at least 1 alphabet, 1 number and 1 special characters"
      });
    } else if (!email_input.match(emailPattern)) {
      return res.status(200).send({
        success: false,
        message: "Incorrect email, please make changes"
      });
    }
    // Correct user input, performing password update
    else {
      sql = `UPDATE user SET email = '${email_input}', password = '${hashpw}', is_active = '${is_active_input}', group_list = '${group_list_input}' WHERE username = '${username}'`;
    }
  }

  db.query(sql, (err, results) => {
    // SQL error messages
    if (err) {
      return res.status(200).send({
        success: false,
        message: "Error updating user"
      });
    }
    // Successful messages
    else {
      // console.log(sql);
      return res.status(200).send({
        success: true,
        message: "User Profile Updated"
      });
    }
  });
};

// Authenticate user
const authUser = async (req, res) => {
  try {
    // Get token value from the json body
    const token = req.query.token;
    // Retrieve group_list for checkgroup
    const check_is_admin = req.query.check_is_admin;
    // If the token is present
    if (token) {
      try {
        const decoded_token = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded_token.username;
        // Perform check group
        const checkgroup_tf = await Checkgroup(username, check_is_admin)
          .then(resolve => {
            if (resolve) {
              return true;
            } else {
              return false;
            }
          })
          .catch(reject => {
            return false;
          });

        // Send successful response
        return res.status(200).send({
          login: true,
          isAdmin: checkgroup_tf,
          username: username
        });
      } catch (e) {
        // Error handling token or any other thing
        console.log(e);
        console.log("Issues with either verifying token or checkgroup");
        return res.status(200).send({
          login: false
        });
      }
    }
    // No token present
    else {
      return res.status(200).send({
        login: false
      });
    }
  } catch (e) {
    // Error retrieving token or group_list from front end
    console.log("Error from the front end");
    return res.status(200).send({
      login: false
    });
  }
};

// Retrieve all group
const getAllGroup = (req, res) => {
  let sql = "SELECT * FROM usergroup";

  db.query(sql, (err, results) => {
    if (err) {
      res.status(200).send({
        success: false,
        message: err
      });
    } else {
      res.status(200).send({
        success: true,
        message: results
      });
    }
  });
};

module.exports = { loginUser, retrieveProfile, updateProfile, createUser, createGroup, getAllUser, updateUser, authUser, getAllGroup };
