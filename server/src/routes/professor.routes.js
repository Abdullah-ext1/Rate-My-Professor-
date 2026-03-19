import { Router } from "express";
import { verifyJwt } from "../middlewares/verifyJwt.js";
import { verifyModerator } from "../middlewares/verifyModerator.js";
import {
    addProfessor,
    getProfessor
} from "../controller/professor.controller.js";

const router = Router()

router.route("/").post(verifyJwt , verifyModerator , addProfessor)
router.route("/").get(verifyJwt , getProfessor)


export default router