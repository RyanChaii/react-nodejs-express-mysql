const db = require("../config/database");
const nodemailer = require("nodemailer");

exports.sendEmail = (fromsSenderUsername, fromSenderEmail, toRecieverEmail, msg) => {
  var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "720e919e5edf04",
      pass: "763191cf321c97"
    }
  });

  transport.sendMail({
    from: `${fromsSenderUsername} ${fromSenderEmail}`,
    to: `${toRecieverEmail}`,
    subject: "Task promotion to done alert",
    text: `${msg}`
  });
};

// Retrieve task without plan
exports.retrieveLeadEmailAndUsername = group_name => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT email FROM user WHERE group_list LIKE "%${group_name}%" `;

    db.query(sql, (err, results) => {
      if (err) {
        console.log(err);
        reject(false);
      } else {
        var emaillist = "";
        for (var i = 0; i < results.length; i++) {
          emaillist = emaillist + results[i].email + ", ";
        }
        resolve(emaillist.replace(/,\s*$/, ""));
      }
    });
  });
};
