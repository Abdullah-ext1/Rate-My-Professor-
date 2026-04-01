import { Router } from "express";
import { verifyJwt } from "../middlewares/verifyJwt.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import { verifyModerator } from "../middlewares/verifyModerator.js";
import { uploadPYQ, getPYQs, deletePYQ, moderatePYQ } from "../controller/pyqs.controller.js";

const router = Router();

router.post("/", verifyJwt, uploadPYQ)
router.get("/", verifyJwt, getPYQs)
router.put("/:pyqId", verifyJwt, verifyModerator, moderatePYQ)
router.delete("/:pyqId", verifyJwt, deletePYQ)

export default router;