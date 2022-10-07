const express = require("express");
const router = express.Router();

//Importing user controller methods
const user = require("../controllers/userController");

router.route("/user").get(user.getUser);

/* Profile route */
// Retrieve profile
router.route("/profile").get(user.retrieveProfile);
// Update profile
router.route("/profile/updateprofile").post(user.updateProfile);

/*User route */
// Login
router.route("/login").post(user.loginUser);
// Create user
router.route("/usermanagement/createuser").post(user.createUser);
// Create group at user management
router.route("/usermanagement/creategroup").post(user.createGroup);

module.exports = router;
