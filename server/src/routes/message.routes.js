import { Router } from "express";
import {getMessages} from "../controller/message.controller.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";

const router = Router();

router.route("/").get(verifyJwt, getMessages);

export default router;