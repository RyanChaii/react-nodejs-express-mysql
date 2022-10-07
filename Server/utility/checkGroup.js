const db = require("../config/database");

// Check group
exports.Checkgroup = (username, groupname) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT * FROM user WHERE username = '${username}' AND group_list LIKE '%${groupname}%'`;

    db.query(sql, (err, results) => {
      if (err) {
        reject(false);
      } else {
        if (results.length == 1) {
          // console.log("its admin");
          resolve(true);
        } else {
          resolve(false);
        }
      }
    });
  });
};
