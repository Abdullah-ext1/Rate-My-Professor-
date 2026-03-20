import { Router } from "express";
import { createPost, deleteAPost, getPosts, likeAPost } from "../controller/post.controller.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";

const router = Router();


router.post("/", verifyJwt, createPost)
router.get("/", verifyJwt, getPosts)
router.patch("/:id/like", verifyJwt, likeAPost)
router.delete("/:id", verifyJwt, deleteAPost)

export default router;  