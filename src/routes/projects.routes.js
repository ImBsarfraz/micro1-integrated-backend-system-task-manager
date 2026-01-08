import express from "express";
import { createProject, updateProject, projectSummary } from "../controllers/projects.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware(["admin", "manager"]), createProject);
router.put("/:id", authMiddleware(["admin", "manager"]), updateProject);
router.get("/:id/summary", authMiddleware(), projectSummary);

export default router;
