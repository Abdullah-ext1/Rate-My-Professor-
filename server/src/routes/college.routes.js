import { Router } from "express";
import { verifyJwt } from "../middlewares/verifyJwt.js";
import { addCollege, deleteCollege, updateCollegeDetails } from "../controller/college.controller.js"; 
import { verifyAdmin } from "../middlewares/verifyAdmin.js";

const router = Router();

router.post("/", verifyJwt, verifyAdmin, addCollege)
router.put("/:id", verifyJwt, verifyAdmin, updateCollegeDetails)
router.delete("/:id", verifyJwt, verifyAdmin, deleteCollege)

export default router;