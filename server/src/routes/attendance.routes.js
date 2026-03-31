import { Router } from "express";
import { verifyJwt } from "../middlewares/verifyJwt.js";

import {
    addSubject,
    markAttendance,
    getAttendance,
    bulkUpdateAttendance,
    deleteAttendance
} from "../controller/attendance.controller.js";

const router = Router()

router.route("/").post(verifyJwt, addSubject)
router.route("/:attendanceId").patch(verifyJwt, markAttendance)
router.route("/").get(verifyJwt, getAttendance)
router.route("/:id").put(verifyJwt, bulkUpdateAttendance)
router.route("/:attendanceId").delete(verifyJwt, deleteAttendance)
export default router