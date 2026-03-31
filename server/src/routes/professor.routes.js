import { Router } from "express";
import { verifyJwt } from "../middlewares/verifyJwt.js";
import { verifyModerator } from "../middlewares/verifyModerator.js";
import {
    addProfessor,
    getProfessor,
    getProfessorById,
    searchProfessor,
    deleteProfessor

} from "../controller/professor.controller.js";

const router = Router()

router.route("/").post(verifyJwt , verifyModerator , addProfessor)
router.route("/").get(verifyJwt , getProfessor)
router.route("/search").get(verifyJwt , searchProfessor)
router.route("/:id").get(verifyJwt , getProfessorById)
router.route("/:id").delete(verifyJwt , verifyModerator , deleteProfessor)

export default router