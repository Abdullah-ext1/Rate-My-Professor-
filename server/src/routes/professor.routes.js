import { Router } from "express";
import { verifyJwt } from "../middlewares/verifyJwt.js";
import { verifyModerator } from "../middlewares/verifyModerator.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import {
    addProfessor,
    getProfessor,
    getProfessorById,
    searchProfessor,
    deleteProfessor,
    moderateProfessor,
    editProfessorRequest
} from "../controller/professor.controller.js";

const router = Router()

router.route("/").post(verifyJwt , addProfessor)
router.route("/").get(verifyJwt , getProfessor)
router.route("/search").get(verifyJwt , searchProfessor)
router.route("/:id").get(verifyJwt , getProfessorById)
router.route("/:id").put(verifyJwt , editProfessorRequest)
router.route("/:id/moderate").put(verifyJwt , verifyModerator , moderateProfessor)
router.route("/:id").delete(verifyJwt , verifyModerator , deleteProfessor)

export default router