import { Router } from "express";
import { createPost } from "../controller/post.controllers.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";

const router = Router();


router.post("/", verifyJwt, createPost)

export default router;  