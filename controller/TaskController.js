const Task = require("../model/TaskModel");
const user = require("../model/User");

const CreateTask = async (req, res, next) => {
  try {
    const { title, priority, checkList, dueDate, taskType, color } = req.body;
    const createdBy = req.body.userId;
    if (!title || !priority || !checkList || !taskType || !createdBy) {
      res.status(400).json({ message: "Bad request" });
    }

    const newTask = new Task({
      title,
      priority,
      checkList,
      dueDate: dueDate ? dueDate : null,
      color,
      taskType,
      createdBy,
    });

    await newTask.save();

    res.status(200).json({ msg: "task created Successfully" });
  } catch (error) {
    console.log(error);
    next(new Error(error));
  }
};

const EditTask = async (req, res) => {
  const { id } = req.params; // ObjectId of the task to update
  const { title, priority, checkList, dueDate, taskType } = req.body; // Fields to update
  try {
    // Update the Task
    const result = await Task.updateOne(
      { _id: id },
      { $set: { title, priority, checkList, dueDate, taskType } } // Set the fields to update
    );

    // Check if the Task was found and updated
    if (result.nModified === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const ChangeTaskType = async (req, res) => {
  const { id } = req.params; // ObjectId of the task to update
  const { taskType } = req.body; // Fields to update
  try {
    // Update the Task
    const result = await Task.updateOne(
      { _id: id },
      { $set: { taskType } } // Set the fields to update
    );

    // Check if the Task was found and updated
    if (result.nModified === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const GetAllAnalytics = async (req, res, next) => {
  try {
    const createdBy = await user.findById(req.body.userId);
    const backlog = await Task.find({
      createdBy: createdBy._id,
      taskType: "backlog",
    }).count();
    const todo = await Task.find({
      createdBy: createdBy._id,
      taskType: "todo",
    }).count();
    const inProgress = await Task.find({
      createdBy: createdBy._id,
      taskType: "in-progress",
    }).count();
    const done = await Task.find({
      createdBy: createdBy._id,
      taskType: "done",
    }).count();
    const lowPriority = await Task.find({
      createdBy: createdBy._id,
      priority: "LOW PRIORITY",
    }).count();
    const moderatePriority = await Task.find({
      createdBy: createdBy._id,
      priority: "MODERATE PRIORITY",
    }).count();
    const highPriority = await Task.find({
      createdBy: createdBy._id,
      priority: "HIGH PRIORITY",
    }).count();
    const duedate = await Task.find({
      createdBy: createdBy._id,
      dueDate: { $exists: true },
    }).count();

    res.status(200).json({
      allBacklogTask: backlog,
      allTodoTask: todo,
      allInProgress: inProgress,
      allDoneTask: done,
      allLowPriorityTask: lowPriority,
      allModeratePriorityTask: moderatePriority,
      allHighPriorityTask: highPriority,
      allDuedateTask: duedate,
    });
  } catch (error) {
    console.log(error);
    next(new Error(error));
  }
};
const GetAllTask = async (req, res, next) => {
  try {
    const createdBy = await user.findById(req.body.userId);
    const response = await Task.find({
      createdBy: createdBy._id,
    });
    res.status(200).json({ response, msg: "Success" });
  } catch (error) {
    console.log(error);
    next(new Error(error));
  }
};
module.exports = {
  CreateTask,
  GetAllAnalytics,
  GetAllTask,
  EditTask,
  ChangeTaskType,
};
