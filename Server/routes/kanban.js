const express = require("express");
const router = express.Router();

//Importing user controller methods
const kanban = require("../controllers/kanbanController");

/* Application */
// Retrieve app
router.route("/kanban/getallapp").get(kanban.getAllApplication);
// Create app
router.route("/kanban/createapp").post(kanban.createApplication);

module.exports = router;
