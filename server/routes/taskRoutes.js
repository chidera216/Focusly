import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createTask,
  deleteTask,
  getTasks,
  toggleTask,
} from "../controller/taskController.js";

const taskRouter = express.Router();

taskRouter.post("/", verifyToken, createTask);
taskRouter.get("/", verifyToken, getTasks);
taskRouter.patch("/:id/toggle", verifyToken, toggleTask);
taskRouter.delete("/:id", verifyToken, deleteTask);

export default taskRouter;
