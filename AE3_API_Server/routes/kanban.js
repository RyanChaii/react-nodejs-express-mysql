const express = require("express");
const router = express.Router();

//Importing user controller methods
const kanban = require("../controllers/kanbanController");

/* Application */
// Retrieve app
router.route("/kanban/getallapp").get(kanban.getAllApplication);
// Create app
router.route("/kanban/createapp").post(kanban.createApplication);
// Edit app
router.route("/kanban/editapp").post(kanban.editApplication);
// Check app permit (for create & edit app)
router.route("/kanban/checkapppermit").get(kanban.checkAppPermit);

// Create Plan
router.route("/kanban/createplan").post(kanban.createPlan);
// Get plan based on app_acronym
router.route("/kanban/getplan").get(kanban.getPlan);
// Update plan
router.route("/kanban/editplan").post(kanban.editPlan);
// Check plan permit (for create, edit & assign app)
router.route("/kanban/checkplanpermit").get(kanban.checkPlanPermit);

// Create Task
// router.route("/kanban/createtask").post(kanban.createTask);
// Get Task
router.route("/kanban/gettask").get(kanban.getTask);
// Update Task
router.route("/kanban/edittask").post(kanban.editTask);
// Promote Task
router.route("/kanban/promotetask").post(kanban.promoteTask);
// Demote Task
router.route("/kanban/demotetask").post(kanban.demoteTask);
// Check Permit (check group function)
router.route("/kanban/checkpermit").get(kanban.checkPermit);

module.exports = router;
