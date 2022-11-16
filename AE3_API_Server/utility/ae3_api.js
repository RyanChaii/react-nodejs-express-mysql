// DB connection
const db = require("../config/database");

// For password comparison
const bcrypt = require("bcrypt");

// Login user
exports.loginUser = (username, password) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT * FROM user WHERE username = ?`;

    db.query(sql, [username], async (err, results) => {
      try {
        if (results.length === 1 && results[0].is_active === 1) {
          if ((await bcrypt.compare(password, results[0].password)) === true) {
            resolve(true);
          } else {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      } catch (err) {
        console.log(err);
        resolve(false);
      }
    });
  });
};

// Check if application exists
exports.checkApplicationExists = applicationName => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT * FROM application WHERE app_acronym = ?`;

    db.query(sql, [applicationName], async (err, results) => {
      try {
        if (results.length === 1) {
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (err) {
        console.log(err);
        resolve(false);
      }
    });
  });
};

// Get app permit create
exports.retrieveAppPermitCreate = applicationName => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT app_permit_create FROM application WHERE app_acronym = ?`;

    db.query(sql, [applicationName], async (err, results) => {
      try {
        if (results.length === 1) {
          resolve(results[0].app_permit_create);
        } else {
          resolve(false);
        }
      } catch (err) {
        console.log(err);
        resolve(false);
      }
    });
  });
};

// Check if task are in valid state
exports.checkTaskInValidState = task_state => {
  var validstate = ["open", "todo", "doing", "done", "close"];
  for (var i = 0; i < validstate.length; i++) {
    if (String(task_state).toLowerCase() === validstate[i]) {
      return true;
    }
  }
  console.log("Task invalid state");
  return false;
};

// Check if task id exists
exports.checkTaskExists = taskID => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT * FROM task WHERE task_id = ?`;

    db.query(sql, [taskID], async (err, results) => {
      try {
        if (results.length === 1) {
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (err) {
        console.log(err);
        resolve(false);
      }
    });
  });
};

// Get app acronym based on task id
exports.retrieveAppAcronym = taskID => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT task_app_acronym FROM task WHERE task_id = ?`;

    db.query(sql, [taskID], async (err, results) => {
      try {
        if (results.length === 1) {
          resolve(results[0].task_app_acronym);
        } else {
          resolve(false);
        }
      } catch (err) {
        console.log(err);
        resolve(false);
      }
    });
  });
};

// Get app permit create
exports.retrieveAppPermitDoing = applicationName => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT app_permit_doing FROM application WHERE app_acronym = ?`;

    db.query(sql, [applicationName], async (err, results) => {
      try {
        if (results.length === 1) {
          resolve(results[0].app_permit_doing);
        } else {
          resolve(false);
        }
      } catch (err) {
        console.log(err);
        resolve(false);
      }
    });
  });
};
