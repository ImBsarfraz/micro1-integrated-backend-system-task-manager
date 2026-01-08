import express from "express";
import {
    createTask,
    updateTaskStatus
} from "../controllers/tasks.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware(["admin", "manager"]),
    validate(["project_id", "title", "priority"]),
    createTask
);

router.put(
    "/:id/status",
    authMiddleware(["admin", "manager"]),
    validate(["status"]),
    updateTaskStatus
);

export default router;
