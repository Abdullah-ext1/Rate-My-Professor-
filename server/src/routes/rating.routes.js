import { Router } from "express";
import { verifyJwt } from "../middlewares/verifyJwt.js";

import {
   addRating,
    getRatings,
     deleteRating
} from "../controller/rating.controller.js";

const router = Router()

router.route("/:professorId").post(verifyJwt , addRating)
router.route("/:professorId").get(verifyJwt , getRatings)
router.route("/:ratingId").delete(verifyJwt , deleteRating)

export default router