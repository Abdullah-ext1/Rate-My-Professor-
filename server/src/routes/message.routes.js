import { Router } from "express";
import { getMessages, createMessage, deleteMessage } from "../controller/message.controller.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";

const router = Router();

router.route("/").get(verifyJwt, getMessages).post(verifyJwt, createMessage);
router.route("/:id").delete(verifyJwt, deleteMessage);

export default router;