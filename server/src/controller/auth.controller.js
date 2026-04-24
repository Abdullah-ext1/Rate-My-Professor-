import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/users.models.js";
import { College } from "../models/college.models.js"
import { Post } from "../models/post.models.js";
import { Comment } from "../models/comment.models.js";
import { createNotification } from "./notification.controller.js";

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

  if (!domainMatches) {
    import('./notification.controller.js').then(async ({ createNotification }) => {
      const adminsAndMods = await User.find({ role: { $in: ['admin', 'moderator'] }, college });
      adminsAndMods.forEach(admin => {
        createNotification({
          userId: admin._id,
          senderId: req.user._id,
          type: 'other',
          content: `New user ${username} wants to join ${collegeFetch.name} and is pending approval.`
        });
      });
    }).catch(err => console.error("Failed to notify admins", err));
  }

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
  const user = await User.findById(req.user.id).populate('college', 'name').lean();
  
  if (user) {
    const postsCount = await Post.countDocuments({ owner: user._id });
    const repliesCount = await Comment.countDocuments({ user: user._id });

    const posts = await Post.find({ owner: user._id });
    let totalPostLikes = 0;
    posts.forEach(p => {
      totalPostLikes += (p.likes ? p.likes.length : 0);
    });

    const comments = await Comment.find({ user: user._id });
    let totalCommentLikes = 0;
    comments.forEach(c => {
      totalCommentLikes += (c.commentLike ? c.commentLike.length : 0);
    });

    user.postsCount = postsCount;
    user.repliesCount = repliesCount;
    user.karma = totalPostLikes + totalCommentLikes;
  }
  
  return res
  .status(200)
  .json(
    new ApiResponse(200, user, "User has been fetched successfully")
  )
})

const getUserProfileById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const profileUser = await User.findById(userId)
    .select("name username avatar department year role college createdAt")
    .populate('college', 'name')
    .lean();

  if (!profileUser) {
    throw new ApiError(404, "User not found");
  }

  const postsCount = await Post.countDocuments({ owner: profileUser._id });
  const repliesCount = await Comment.countDocuments({ user: profileUser._id });

  const posts = await Post.find({ owner: profileUser._id }).select("likes");
  const totalPostLikes = posts.reduce((acc, p) => acc + (p.likes ? p.likes.length : 0), 0);

  const comments = await Comment.find({ user: profileUser._id }).select("commentLike");
  const totalCommentLikes = comments.reduce((acc, c) => acc + (c.commentLike ? c.commentLike.length : 0), 0);

  const userProfile = {
    ...profileUser,
    postsCount,
    repliesCount,
    karma: totalPostLikes + totalCommentLikes,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, userProfile, "User profile fetched successfully"));
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

  return res
  .status(200)
  .json(
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

const getAllModerators = asyncHandler(async (req, res) => {
  const moderators = await User.find({ role: 'moderator' }).populate('college', 'name');

  return res.status(200).json(
    new ApiResponse(200, moderators, "Fetched all moderators successfully")
  );
})

const revokeModerator = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { role: 'user' } },
    { new: true }
  ).populate('college', 'name');

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const createNotificationForRevokedModerator = await createNotification({
    userId: userId,
    content: "Your moderator role has been revoked. You are now a regular user."
  });

  return res.status(200).json(
    new ApiResponse(200, user, "Moderator role revoked successfully")
  );
})

const reportUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (userId.toString() === req.user._id.toString()) {
    throw new ApiError(400, "You cannot report yourself");
  }

  const reportedUser = await User.findById(userId);
  if (!reportedUser) {
    throw new ApiError(404, "User not found");
  }

  const adminsAndMods = await User.find({ role: { $in: ['admin', 'moderator'] } });
  
  import('./notification.controller.js').then(({ createNotification }) => {
    adminsAndMods.forEach(admin => {
      createNotification({
        userId: admin._id,
        senderId: req.user._id,
        type: 'other',
        content: `User @${reportedUser.username} (${reportedUser.name}) was reported by another user.`
      });
    });
  });

  return res.status(200).json(new ApiResponse(200, null, "User reported successfully"));
});

export {
  onboardingAuth,
  changeAccountDetails,
  getCurrentUser,
  getUserProfileById,
  logOutUser,
  bannedUser,
  suspendUser,
  checkUsernameAvailability,
  approvePendingUser,
  rejectPendingUser,
  getPendingUsers,
  revokeModerator,
  getAllModerators,
  reportUser
}