const db = require("../config/database");

// Retrieve task without plan
exports.retrieveTask = app_acronym => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT * FROM task WHERE task_app_acronym = '${app_acronym}'`;

    db.query(sql, (err, results) => {
      if (err) {
        reject(false);
      } else {
        try {
          resolve(results);
        } catch (e) {
          reject(false);
        }
      }
    });
  });
};

// Retrieve task with plan
exports.retrieveTaskWithPlan = app_acronym => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT DISTINCT task.*, plan.plan_colorcode  FROM task
    INNER JOIN plan ON task.task_plan = plan.plan_mvp_name
    Where plan.plan_app_acronym  = task.task_app_acronym AND task.task_app_acronym = '${app_acronym}'`;

    db.query(sql, (err, results) => {
      if (err) {
        console.log(err);
        reject(false);
      } else {
        try {
          resolve(results);
        } catch (e) {
          reject(false);
        }
      }
    });
  });
};

// exports.retrievePlan = app_acronym => {
//   return new Promise((resolve, reject) => {
//     let sql = `SELECT * FROM plan WHERE plan_app_acronym = '${app_acronym}'`;

//     db.query(sql, (err, results) => {
//       if (err) {
//         reject(false);
//       } else {
//         try {
//           resolve(results);
//         } catch (e) {
//           reject(false);
//         }
//       }
//     });
//   });
// };
