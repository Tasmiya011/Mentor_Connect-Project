import express from "express";
import { smartMatch } from "../controllers/smartMatchController.js";
const router = express.Router();
router.post("/smart-match", smartMatch);
export default router;