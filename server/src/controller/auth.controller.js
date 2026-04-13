import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/users.models.js";
import { College } from "../models/college.models.js"

const onboardingAuth = asyncHandler( async(req, res) => {
  const {college, department, year, username} = req.body;
  const isAdmin = req.user.role === 'admin';
  
  // Admins only need username
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

  // Regular users need all fields
  if(!college || !department || !year || !username){
    throw new ApiError(401, "All Fields are necessary")
  }

  const collegeFetch = await College.findById(college)
  if (!collegeFetch) {
    throw new ApiError(404, "College not found")
  }

  // Check if user's email domain matches college domain
  const userDomain = req.user.email.split("@")[1]
  const domainMatches = collegeFetch.domain === userDomain
  
  // If domain matches: status='active' (instant access)
  // If domain doesn't match: status='pending' (needs moderator approval)
  const userStatus = domainMatches ? 'active' : 'pending'

  const user = await User.findByIdAndUpdate(
    req.user?.id,
    {
      $set:{
        college,
        department,
        year,
        username,
        status: userStatus
      }
  },
  {new: true})

  const message = domainMatches 
    ? "Onboarding completed successfully! Welcome to your college community." 
    : "Onboarding completed. Your account is pending moderator approval."

  return res
  .status(201)
  .json(
    new ApiResponse("200", user, message)
  )
})

const changeAccountDetails = asyncHandler(async (req, res) => {
    // change name, username, college, department, year
    const {name, username, department, year} = req.body
    console.log('body:', req.body)
    console.log('user id:', req.user?.id)
  



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

const approvePendingUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { status: 'active' } },
    { new: true }
  ).populate('college', 'name');

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // NOTE: If testing locally without notifications module yet, this might error.
  // We'll wrap it in try/catch or assume createNotification works.
  try {
    await createNotification({
      userId: userId,
      type: "approval",
      content: "Your account has been approved! You can now access the community."
    });
  } catch(e) {
    console.log("No notification service set up for approvals yet, skipping...", e);
  }

  return res.status(200).json(
    new ApiResponse(200, user, "User approved successfully")
  );
});

const rejectPendingUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const { reason } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { status: 'rejected' } },
    { new: true }
  ).populate('college', 'name');

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  try {
    await createNotification({
      userId: userId,
      type: "rejection",
      content: `Your account was rejected. Reason: ${reason || 'No reason provided'}`
    });
  } catch(e) {
    console.log("No notification service set up for rejections yet, skipping...", e);
  }

  return res.status(200).json(
    new ApiResponse(200, user, "User rejected successfully")
  );
});

const getPendingUsers = asyncHandler(async (req, res) => {
  // Only fetching users that are currently pending, sorted oldest first
  const pendingUsers = await User.find({ status: 'pending' })
    .populate('college', 'name')
    .sort({ createdAt: 1 });

  return res.status(200).json(
    new ApiResponse(200, pendingUsers, "Fetched pending users")
  );
});

export {
  onboardingAuth,
  changeAccountDetails,
  getCurrentUser,
  logOutUser,
  bannedUser,
  suspendUser,
  checkUsernameAvailability,
  approvePendingUser,
  rejectPendingUser,
  getPendingUsers,
}