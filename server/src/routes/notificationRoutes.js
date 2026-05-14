// src/routes/notificationRoutes.js
import express from "express";
import { getNotificationsForUser, markNotificationRead } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/user/:id", getNotificationsForUser); // GET /api/notifications/user/:id?model=Student
router.put("/:id/read", markNotificationRead); // PUT /api/notifications/:id/read

export default router;
