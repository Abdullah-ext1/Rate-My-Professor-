import { Router } from "express";
import { getMessages, createMessage } from "../controller/message.controller.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";

const router = Router();

router.route("/").get(verifyJwt, getMessages).post(verifyJwt, createMessage);

export default router;