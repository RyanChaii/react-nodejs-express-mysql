const express = require("express");
const router = express.Router();

//Importing user controller methods
const user = require("../controllers/userController");

/* Profile route */
// Retrieve profile
router.route("/profile").get(user.retrieveProfile);
// Update profile
router.route("/profile/updateprofile").post(user.updateProfile);

/*User route */
// Login
// router.route("/login").post(user.loginUser);
// Auth User
router.route("/authuser").get(user.authUser);
// Create user
// router.route("/usermanagement/createuser").post(user.createUser);
// Create group at user management
router.route("/usermanagement/creategroup").post(user.createGroup);
// Retrieve all user from database
router.route("/usermanagement/getalluser").get(user.getAllUser);
// Update user
router.route("/usermanagement/updateuser").post(user.updateUser);
// Retrieve all group from database
router.route("/usermanagement/getallgroup").get(user.getAllGroup);

module.exports = router;
