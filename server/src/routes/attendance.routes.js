import { Router } from "express";
import { verifyJwt } from "../middlewares/verifyJwt.js";

import {
    addSubject,
    markAttendance,
    getAttendance
} from "../controller/attendance.controller.js";

const router = Router()

router.route("/").post(verifyJwt, addSubject)
router.route("/:attendanceId").patch(verifyJwt, markAttendance)
router.route("/").get(verifyJwt, getAttendance)

export default router