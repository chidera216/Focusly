import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createSession,
  getStats,
  totalMinutes,
} from "../controller/sessionController.js";

const sessionRouter = express.Router();

sessionRouter.post("/", verifyToken, createSession);
sessionRouter.get("/total", verifyToken, totalMinutes);
sessionRouter.get("/stats/:range", verifyToken, getStats);

export default sessionRouter;
