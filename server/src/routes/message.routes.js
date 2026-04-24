import { Router } from "express";
import {
	getMessages,
	createMessage,
	deleteMessage,
	suspendMessageSender,
	banMessageSender,
	promoteMessageSenderToModerator,
	demoteMessageSenderFromModerator,
	reportMessage
} from "../controller/message.controller.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";

const router = Router();

router.route("/").get(verifyJwt, getMessages).post(verifyJwt, createMessage);
router.route("/:id").delete(verifyJwt, deleteMessage);
router.route("/:id/suspend").post(verifyJwt, suspendMessageSender);
router.route("/:id/ban").post(verifyJwt, banMessageSender);
router.route("/:id/promote-moderator").post(verifyJwt, promoteMessageSenderToModerator);
router.route("/:id/demote-moderator").post(verifyJwt, demoteMessageSenderFromModerator);
router.route("/:id/report").post(verifyJwt, reportMessage);

export default router;