import { Router } from "express";
import { Comment } from "../models/comment.models.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";
import { createAComment } from "../controller/comment.controller.js";

const router = Router();

router.post("/:postId", verifyJwt, createAComment)

export default router;