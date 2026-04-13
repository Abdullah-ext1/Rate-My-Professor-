import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {PYQ} from '../models/pyqs.models.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import { createNotification } from './notification.controller.js';

const uploadPYQ = asyncHandler(async (req, res) => {
  const {subjectName, year, questionPaperUrl, examType} = req.body

  if(!subjectName || !year || !questionPaperUrl || !examType) {
    throw new ApiError(400, "All fields are required")
  }

  const pyq = await PYQ.create({
    subjectName,
    year,
    questionPaperUrl,
    examType,
    college: req.user.college,
    owner: req.user._id
  })

  return res
  .status(201)
  .json(
    new ApiResponse(201, pyq, "PYQ uploaded successfully")
  )
})

const moderatePYQ = asyncHandler(async (req, res) => {
  const {pyqId} = req.params
  const {isApproved} = req.body

  if(isApproved === undefined) {
    throw new ApiError(400, "isApproved field is required")
  }

  const pyq = await PYQ.findByIdAndUpdate(
    pyqId, 
    { $set: { isApproved: isApproved } },
    { new: true }
  );
  
  if(!pyq) {
    throw new ApiError(404, "PYQ not found")
  }

  if(isApproved === true) {
    await createNotification({
      userId: pyq.owner,
      type: 'pyqApproved',
      content: `Your submission "${pyq.subjectName} ${pyq.year} - ${pyq.examType}" has been approved!`
    })
  } else {
    await createNotification({
      userId: pyq.owner,
      type: 'pyqRejected',
      content: `Your submission "${pyq.subjectName} ${pyq.year} - ${pyq.examType}" has been rejected.`
    })
  }

  

  return res
  .status(200)
  .json(
    new ApiResponse(200, pyq, "PYQ moderated successfully")
  )
})


const getPYQs = asyncHandler(async (req, res) => {
  const {subjectName, year, examType} = req.query

  const filter = (req.user.role === 'admin' || req.user.role === 'moderator') 
    ? {} 
    : { college: req.user.college };

  if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
    // Normal user sees approved ones OR their own uploads
    filter.$or = [
      { isApproved: true },
      { owner: req.user._id }
    ];
  }
  if(req.query.isApproved !== undefined && (req.user.role === 'admin' || req.user.role === 'moderator')) {
    filter.isApproved = req.query.isApproved === 'true'
  }


  if(subjectName) {
    filter.subjectName = subjectName
  }
  if(year) {
    filter.year = year
  }
  if(examType) {
    filter.examType = examType
  }

  const pyqs = await PYQ.find(filter).sort({createdAt: -1}).populate('owner', 'name')

  return res
  .status(200)
  .json(
    new ApiResponse(200, pyqs, "PYQs fetched successfully")
  )
})

// Student uploads PYQ
// Moderator approves PYQ
// Students fetches/searches approved PYQs


const deletePYQ = asyncHandler(async (req, res) => {
  const {pyqId} = req.params

  const pyq = await PYQ.findById(pyqId)

  if(!pyq) {
    throw new ApiError(404, "PYQ not found")
  }

  if(pyq.owner.toString() !== req.user._id.toString() && req.user.role !== "moderator" && req.user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to delete this PYQ")
  }

  await PYQ.deleteOne({ _id: pyq._id })

  return res
  .status(200)
  .json(
    new ApiResponse(200, null, "PYQ deleted successfully")
  )
})

export {
  uploadPYQ,
  getPYQs,
  moderatePYQ,
  deletePYQ
}