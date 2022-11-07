const db = require("../config/database");

// Retrieve task current state
exports.retrieveCurrentTaskState = task_id => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT task_state FROM task WHERE task_id = ?`;

    db.query(sql, [task_id], (err, results) => {
      if (err) {
        reject(false);
      } else {
        try {
          resolve(results[0].task_state);
        } catch (e) {
          reject(false);
        }
      }
    });
  });
};

// Retrieve all permit group from application
exports.retrieveApplicationPermit = task_app_acronym => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT app_permit_open, app_permit_todolist, app_permit_doing, app_permit_done FROM application WHERE app_acronym = ?`;

    db.query(sql, [task_app_acronym], (err, results) => {
      if (err) {
        reject(false);
      } else {
        try {
          resolve(results[0]);
        } catch (e) {
          reject(false);
        }
      }
    });
  });
};

// Retrieve current task notes
exports.retrieveTaskNotes = task_id => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT task_notes FROM task WHERE task_id = ?`;

    db.query(sql, [task_id], (err, results) => {
      if (err) {
        reject(false);
      } else {
        try {
          resolve(results[0].task_notes);
        } catch (e) {
          reject(false);
        }
      }
    });
  });
};
