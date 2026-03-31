import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { College } from "../models/college.models.js";


const addCollege = asyncHandler( async (req, res) => {
  const {name, location, domain, website} = req.body

  if(!name || !location || !domain || !website){
    throw new ApiError(401, "College name field is necessarry")
  }

  const college = await College.create({
    name,
    location,
    domain,
    website
  })

  return res
  .status(201)
  .json(
    new ApiResponse(201, college, "College's detail added successfully")
  )
})

const updateCollegeDetails = asyncHandler(async (req, res) => {
  const {name, location, domain , website} = req.body

  if(!name || !location || !domain || !website){
    throw new ApiError(401, "All fields are necessary to update college details")
  }

  const collegeId = req.params.id

  if(!collegeId){
    throw new ApiError(401, "College Id is necessary to update college details")
  }

  const updateCollege = await College.findByIdAndUpdate(collegeId,
    {
      $set: {
        name,
        location,
        domain,
        website
      }
    }, {new: true}
  )

  return res
  .status(201)
  .json(
    new ApiResponse(201, updateCollege, "College updated successfully")
  )
})

const deleteCollege = asyncHandler(async (req, res) => {
  const collegeId = req.params.id

  if(!collegeId){
    throw new ApiError(401, "College Id is necessary to delete college details")
  }

  const college = await College.findByIdAndDelete(collegeId)

  return res
  .status(200)
  .json(
    new ApiResponse(200, college, "College deleted successfully")
  )
})



export {
  addCollege,
  updateCollegeDetails,
  deleteCollege
}