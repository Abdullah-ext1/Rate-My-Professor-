import { Router } from "express";
import { verifyJwt } from "../middlewares/verifyJwt.js";
import { getAllNotifications, markAsRead, getUnreadCount } from "../controller/notification.controller.js";

const router = Router()

router.get("/unread", verifyJwt, getUnreadCount)
router.get("/", verifyJwt, getAllNotifications)
router.patch("/:id", verifyJwt, markAsRead)

export default router