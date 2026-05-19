import { Router } from "express";
import { verifyJwt } from "../middlewares/verifyJwt.js";
import { generateQuiz, getQuizById, getQuizzesByNoteId, getAllQuizzes, generateStandaloneQuiz, quizFileUpload, reQuiz, deleteQuiz } from "../controller/quiz.controller.js";

const router = Router();

router.post("/generate", verifyJwt, generateQuiz);
router.post("/generate-standalone", verifyJwt, quizFileUpload, generateStandaloneQuiz);
router.post("/requiz/:quizId", verifyJwt, reQuiz);
router.get("/note/:pyqId", verifyJwt, getQuizzesByNoteId);
router.get("/all", verifyJwt, getAllQuizzes);
router.get("/:quizId", verifyJwt, getQuizById);
router.delete("/:quizId", verifyJwt, deleteQuiz);

export default router;
