import { Router } from "express";
import { verifyJwt } from "../middlewares/verifyJwt.js";
import { getLeaderboard } from "../controller/leaderboard.controller.js";

const router = Router()

router.route("/").get(verifyJwt , getLeaderboard)

export default router