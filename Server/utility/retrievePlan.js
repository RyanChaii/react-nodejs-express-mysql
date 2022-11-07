const db = require("../config/database");

// Retrieve task without plan
exports.retrievePlan = task_id => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT task_plan FROM task WHERE task_id = '${task_id}'`;

    db.query(sql, (err, results) => {
      if (err) {
        reject(false);
      } else {
        try {
          resolve(results[0].task_plan);
        } catch (e) {
          reject(false);
        }
      }
    });
  });
};
