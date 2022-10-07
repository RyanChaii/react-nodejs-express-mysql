const express = require("express");
const router = express.Router();

//Importing user controller methods
const user = require("../controllers/userController");

router.route("/user").get(user.getUser);

// Profile route
router.route("/profile").get(user.retrieveProfile);
router.route("/profile/updateprofile").post(user.updateProfile);

// User route
router.route("/login").post(user.loginUser);
router.route("/usermanagement/createuser").post(user.createUser);

module.exports = router;
