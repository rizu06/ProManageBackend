const express = require("express");
const router = express.Router();
const {
  CreateTask,
  GetAllAnalytics,
  GetAllTask,
  EditTask,
  ChangeTaskType,
} = require("../controller/TaskController");
const jwt = require("../middleware/Auth");

router.post("/createTask", jwt, CreateTask);
router.put("/editTask/:id", jwt, EditTask);
router.patch("/changeType/:id", jwt, ChangeTaskType);
router.get("/task-analytics", jwt, GetAllAnalytics);
router.get("/GetAllTask", jwt, GetAllTask);

module.exports = router;
