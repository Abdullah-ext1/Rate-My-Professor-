import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/users.models.js";
import { College } from "../models/college.models.js"

const onboardingAuth = asyncHandler( async(req, res) => {
  // Get college, department, year from req.body
  // Find the college in MongoDB by its _id
  // Extract domain from req.user.email
  // Compare with college.domain
  // If no match → throw ApiError
  // If match → update user with college, department, year
  // Return updated user

  // if user admin then he be livin yk what i mean
  const {college, department, year, username} = req.body;
  const isAdmin = req.user.role === 'admin';
  
  if (isAdmin) {
    if (!username) {
      throw new ApiError(401, "Username is necessary")
    }
    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { $set: { username } },
      { new: true }
    )
    return res.status(201).json(
      new ApiResponse("200", user, "Admin setup completed successfully")
    )
  }

  

  const domain = req.user.email.split("@")[1]

  if(!college || !department || !year || !username){
    throw new ApiError(401, "All Fields are necessary")
  }

  const collegeDomain = await College.findById(college)

  if(collegeDomain.domain !== domain){
    throw new ApiError(401, "College domain wasn't found")
  }

  const user = await User.findByIdAndUpdate(
    req.user?.id,
    {
      $set:{
        college,
        department,
        year,
        username
      }
  },
  {new: true})

  return res
  .status(201)
  .json(
    new ApiResponse("200", user, "Onboarding Authentification was successfully done")
  )
})

const changeAccountDetails = asyncHandler(async (req, res) => {
    // change name, username, college, department, year
    const {name, username, department, year} = req.body

    const user = await User.findByIdAndUpdate(req.user?.id,
      {
        $set: {
          name,
          username,
          department,
          year
        }
      }, 
      { new: true }
    )

    return res
    .status(201)
    .json(
      new ApiResponse(201, user, "Account details changed successfully")
    )
});

const getCurrentUser = asyncHandler(async (req, res) => {

  const user = await User.findById(req.user.id).populate('college', 'name')

  return res
  .status(201)
  .json(
    new ApiResponse(201, user, "User has been fetched successfully")
  )
})

const logOutUser = asyncHandler(async (req, res) => {
 
  const options = {
    httpOnly: true,
    secure: true
  }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"))
})

const bannedUser = asyncHandler(async (req, res) => {
  const userId = req.params.id
  if(!userId){
    throw new ApiError(401, "User Id is required")
  }

  const user = await User.findById(userId)
  if(!user){
    throw new ApiError(401, "User doesnt exists")
  }

  const banUser = await User.findByIdAndUpdate(userId, {isBanned: true})
  return res
  .status(201)
  .json(
    new ApiResponse(201, banUser, "User was banned successfully")
  )
})

const suspendUser = asyncHandler(async(req, res) => {
  const userId = req.params.id
  if(!userId){
    throw new ApiError(401, "User Id is required")
  }

  const user = await User.findById(userId)
  if(!user){
    throw new ApiError(401, "User doesnt exists")
  }

  const banUser = await User.findByIdAndUpdate(userId, 
    { 
      isBanned: true,
      bannedUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    }
  )
  return res
  .status(201)
  .json(
    new ApiResponse(201, banUser, "User was suspended for 14 days successfully")
  )
})

const checkUsernameAvailability = asyncHandler(async (req, res) => {
  const { username } = req.query;

  if (!username || username.trim().length === 0) {
    throw new ApiError(400, "Username is required");
  }

  const existingUser = await User.findOne({ username: username.trim().toLowerCase() });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { exists: !!existingUser }, "Username check completed")
    );
});

export {
  onboardingAuth,
  changeAccountDetails,
  getCurrentUser,
  logOutUser,
  bannedUser,
  suspendUser,
  checkUsernameAvailability
}