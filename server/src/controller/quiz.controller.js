import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Quiz } from '../models/quiz.models.js';
import { PYQ } from '../models/pyqs.models.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateQuizFromContent } from '../utils/groq.js';
import multer from 'multer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

// Multer memory storage — files never hit disk
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
export const quizFileUpload = upload.single('file');

// POST /api/quiz/generate
// Body: { pyqId, customText? }
const generateQuiz = asyncHandler(async (req, res) => {
  const { pyqId, customText } = req.body;

  if (!pyqId) {
    throw new ApiError(400, "pyqId is required");
  }

  const pyq = await PYQ.findById(pyqId);
  if (!pyq) {
    throw new ApiError(404, "Note not found");
  }

  if (pyq.examType !== 'Notes') {
    throw new ApiError(400, "Quizzes can only be generated from Notes, not PYQs");
  }

  // If user provided custom text, save it to the note for future use
  let contentForQuiz = customText || pyq.notesContent;

  if (customText && !pyq.notesContent) {
    pyq.notesContent = customText;
    await pyq.save();
  }

  if (!contentForQuiz || contentForQuiz.trim().length === 0) {
    throw new ApiError(400, "No notes content available. Please provide text content to generate a quiz.");
  }

  // Always generate fresh — user can create multiple quizzes per note
  const questions = await generateQuizFromContent(pyq.subjectName, contentForQuiz);

  const quiz = await Quiz.create({
    pyqId: pyq._id,
    subjectName: pyq.subjectName,
    semester: pyq.year,
    questions,
    sourceContent: contentForQuiz,
    generatedBy: req.user._id
  });

  return res
    .status(201)
    .json(new ApiResponse(201, quiz, "Quiz generated successfully"));
});

// GET /api/quiz/:quizId
const getQuizById = asyncHandler(async (req, res) => {
  const { quizId } = req.params;

  const quiz = await Quiz.findById(quizId)
    .populate('generatedBy', 'name username avatar');

  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, quiz, "Quiz fetched successfully"));
});

// GET /api/quiz/note/:pyqId
// Returns all quizzes for a given note
const getQuizzesByNoteId = asyncHandler(async (req, res) => {
  const { pyqId } = req.params;

  const quizzes = await Quiz.find({ pyqId })
    .sort({ createdAt: -1 })
    .populate('generatedBy', 'name username avatar');

  return res
    .status(200)
    .json(new ApiResponse(200, quizzes, "Quizzes fetched successfully"));
});

// GET /api/quiz
// Returns all saved quizzes (global)
const getAllQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find()
    .sort({ createdAt: -1 })
    .populate('generatedBy', 'name username avatar')
    .select('-questions -sourceContent'); // Don't send full questions or source in list view

  return res
    .status(200)
    .json(new ApiResponse(200, quizzes, "All quizzes fetched successfully"));
});

// POST /api/quiz/generate-standalone
// Body (multipart): file (.txt/.pdf), subjectName, semester, OR textContent (pasted)
const generateStandaloneQuiz = asyncHandler(async (req, res) => {
  const { subjectName, semester, textContent } = req.body;

  if (!subjectName || !semester) {
    throw new ApiError(400, 'Subject name and semester are required');
  }

  let content = textContent || '';

  // If file uploaded, extract text from it
  if (req.file) {
    const ext = req.file.originalname.split('.').pop().toLowerCase();
    if (ext === 'txt') {
      content = req.file.buffer.toString('utf-8');
    } else if (ext === 'pdf') {
      try {
        const pdfData = await pdf(req.file.buffer);
        content = pdfData.text;
      } catch (e) {
        throw new ApiError(400, 'Failed to parse PDF file');
      }
    } else {
      throw new ApiError(400, 'Only .txt and .pdf files are supported');
    }
  }

  if (!content || content.trim().length < 50) {
    throw new ApiError(400, 'Please provide enough text content (at least 50 characters) to generate a quiz.');
  }

  const questions = await generateQuizFromContent(subjectName, content);

  const quiz = await Quiz.create({
    pyqId: null,
    subjectName,
    semester: parseInt(semester),
    questions,
    sourceContent: content,
    generatedBy: req.user._id
  });

  return res
    .status(201)
    .json(new ApiResponse(201, quiz, 'Quiz generated successfully'));
});

// POST /api/quiz/requiz/:quizId
// Generates fresh questions using the saved sourceContent from an existing quiz
const reQuiz = asyncHandler(async (req, res) => {
  const { quizId } = req.params;

  const existingQuiz = await Quiz.findById(quizId);
  if (!existingQuiz) {
    throw new ApiError(404, 'Quiz not found');
  }

  // Try sourceContent first, then fall back to linked note's content
  let content = existingQuiz.sourceContent;
  if ((!content || content.trim().length < 50) && existingQuiz.pyqId) {
    const pyq = await PYQ.findById(existingQuiz.pyqId);
    if (pyq?.notesContent) content = pyq.notesContent;
  }

  if (!content || content.trim().length < 50) {
    throw new ApiError(400, 'No source content available to regenerate quiz');
  }

  const questions = await generateQuizFromContent(existingQuiz.subjectName, content);

  const newQuiz = await Quiz.create({
    pyqId: existingQuiz.pyqId,
    subjectName: existingQuiz.subjectName,
    semester: existingQuiz.semester,
    questions,
    sourceContent: content,
    generatedBy: req.user._id
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newQuiz, 'New quiz generated successfully'));
});

// DELETE /api/quiz/:quizId
// Admin/Moderator only
const deleteQuiz = asyncHandler(async (req, res) => {
  const { quizId } = req.params;

  if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
    throw new ApiError(403, 'Only admins and moderators can delete quizzes');
  }

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new ApiError(404, 'Quiz not found');
  }

  await Quiz.findByIdAndDelete(quizId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Quiz deleted successfully'));
});

export {
  generateQuiz,
  getQuizById,
  getQuizzesByNoteId,
  getAllQuizzes,
  generateStandaloneQuiz,
  reQuiz,
  deleteQuiz
};
