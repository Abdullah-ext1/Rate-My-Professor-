import { Router } from "express";
import { verifyJwt } from "../middlewares/verifyJwt.js";
import { getAllNotifications, markAsRead, markAllAsRead, getUnreadCount, subscribePush } from "../controller/notification.controller.js";

const router = Router()

router.get("/unread", verifyJwt, getUnreadCount)
router.get("/", verifyJwt, getAllNotifications)
router.put("/mark-all-read", verifyJwt, markAllAsRead)
router.patch("/:id", verifyJwt, markAsRead)
router.post("/subscribe", verifyJwt, subscribePush)

export default router