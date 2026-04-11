import { Router } from "express";
import { verifyJwt } from "../middlewares/verifyJwt.js";
import { createAComment, deleteAComment, getAllCommentsOfAPost, replyToAComment, likeAComment } from "../controller/comment.controller.js";

const router = Router();

router.post("/:postId", verifyJwt, createAComment)
router.post("/:commentId/reply", verifyJwt, replyToAComment)
router.delete("/:id", verifyJwt, deleteAComment)
router.get("/:id", verifyJwt, getAllCommentsOfAPost)
router.patch("/:id/like", verifyJwt, likeAComment)


export default router;