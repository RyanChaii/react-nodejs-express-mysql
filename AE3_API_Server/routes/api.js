const express = require("express");
const router = express.Router();

//Importing api controller methods
const api = require("../controllers/APIController");

// Create Task
router.route("/api/CreateTask").post(api.createTask);

// Get task by state
router.route("/api/GetTaskByState").post(api.getTasksByState);

// Promote task 2 done
router.route("/api/PromoteTask2Done").post(api.promoteTask2Done);

module.exports = router;
