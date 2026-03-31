import { Router } from "express";
import { createPost, deleteAPost, getPostById, getPosts, getTrendingPosts, likeAPost } from "../controller/post.controller.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";

const router = Router();


router.post("/", verifyJwt, createPost)
router.get("/", verifyJwt, getPosts)
router.patch("/:id/like", verifyJwt, likeAPost)
router.delete("/:id", verifyJwt, deleteAPost)
router.get("/:id", verifyJwt, getPostById)
router.get("/trending", verifyJwt, getTrendingPosts)

export default router;  