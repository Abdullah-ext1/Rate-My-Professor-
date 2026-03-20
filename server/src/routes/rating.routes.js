import { Router } from "express";
import { verifyJwt } from "../middlewares/verifyJwt.js";

import {
   addRating,
    getRatings
} from "../controller/rating.controller.js";

const router = Router()

router.route("/:professorId").post(verifyJwt , addRating)
router.route("/:professorId").get(verifyJwt , getRatings)

export default router