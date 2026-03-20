import { Router } from "express";
import { verifyJwt } from "../middlewares/verifyJwt.js";
import { createAComment, replyToAComment } from "../controller/comment.controller.js";

const router = Router();

router.post("/:postId", verifyJwt, createAComment)
router.post("/:commentId/reply", verifyJwt, replyToAComment)

export default router;