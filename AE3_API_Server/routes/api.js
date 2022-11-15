const express = require("express");
const router = express.Router();

//Importing api controller methods
const api = require("../controllers/APIController");

// Create Task
router.route("/api/createTask").post(api.createTask);

module.exports = router;