const db = require("../config/database");

// Retrieve rnumber
exports.retrieveRnumber = app_acronym => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT app_rnumber FROM application WHERE app_acronym = '${app_acronym}'`;

    db.query(sql, (err, results) => {
      if (err) {
        reject(false);
      } else {
        try {
          resolve(results[0].app_rnumber);
        } catch (e) {
          reject(false);
        }
      }
    });
  });
};

// Update Rnumber
exports.updateRnumber = (app_acronym, app_rnumber) => {
  return new Promise((resolve, reject) => {
    let sql = `UPDATE application SET app_rnumber = '${app_rnumber}' WHERE app_acronym = '${app_acronym}'`;

    db.query(sql, (err, results) => {
      if (err) {
        reject(false);
      } else {
        try {
          resolve(true);
        } catch (e) {
          reject(false);
        }
      }
    });
  });
};
