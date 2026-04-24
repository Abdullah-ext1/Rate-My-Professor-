import { Router } from "express";
import { verifyJwt } from "../middlewares/verifyJwt.js";

import {
   addRating,
    getRatings,
      deleteRating,
      voteOnRating
} from "../controller/rating.controller.js";

const router = Router()

router.route("/:professorId").post(verifyJwt , addRating)
router.route("/:professorId").get(verifyJwt , getRatings)
router.route("/:ratingId").delete(verifyJwt , deleteRating)
   router.route("/vote/:ratingId").patch(verifyJwt, voteOnRating)

export default router