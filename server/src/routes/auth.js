import express from "express";
import { loginUser } from "../controllers/authController.js";
import { signupUser } from "../controllers/signupController.js";

const router = express.Router();

// public routes
router.post("/login", loginUser);
router.post("/signup", signupUser);

export default router;