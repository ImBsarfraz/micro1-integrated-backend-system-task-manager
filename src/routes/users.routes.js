import express from "express";
import {
    createUser,
    listUsers
} from "../controllers/users.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post(
    "/",
    // authMiddleware(["admin"]),
    validate(["name", "email", "password", "role"]),
    createUser
);

router.get(
    "/",
    authMiddleware(["admin"]),
    listUsers
);

export default router;
