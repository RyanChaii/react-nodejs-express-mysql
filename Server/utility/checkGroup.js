const db = require("../config/database");

// Check group
exports.Checkgroup = (username, groupname) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT group_list FROM user WHERE username = '${username}'`;

    db.query(sql, (err, results) => {
      if (err) {
        reject(false);
      } else {
        console.log("123");
        console.log(results);
        // Check if its empty string
        if (results[0].group_list != "") {
          // Split the string
          const group_array = results[0].group_list.split(",");
          // Belong to the group
          if (group_array.includes(groupname)) {
            resolve(true);
          }
          // Does not belong to the group
          else {
            resolve(false);
          }
        }
        // User does not belonged to any group or not assigned to any
        else {
          resolve(false);
        }
      }
    });
  });
};
