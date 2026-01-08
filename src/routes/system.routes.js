import express from "express";
import { systemHealth } from "../controllers/system.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
    "/health",
    authMiddleware(["admin"]),
    systemHealth
);

export default router;
