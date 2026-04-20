import { Post } from "../models/post.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createNotification } from "./notification.controller.js";
import { getCollegeFilter } from "../utils/collegeFilter.js";

const createPost = asyncHandler( async(req, res) => {
  const {title, content, tags} = req.body;

  if(!title){
    throw new ApiError(400, "Title is required");
  }

  if(!content){
    throw new ApiError(400, "Content is required");
  }

  if(!tags){
    throw new ApiError(400, "Tag is required");
  }

  const post = await Post.create({
    title,
    content,
    tags,
    owner: req.user.id,
    college: req.user.college,
  })

  return res
  .status(201)
  .json(
    new ApiResponse("200", post, "Post created successfully")
  )
})

const getPosts = asyncHandler(async( req, res ) => {
  const isPaginatedRequest = req.query.page !== undefined || req.query.limit !== undefined
  const page = Math.max(Number(req.query.page) || 1, 1)
  const limit = Math.max(Number(req.query.limit) || 10, 1)
  const skip = (page - 1) * limit
  const sortMode = ['hot', 'new', 'top'].includes(req.query.sort) ? req.query.sort : 'hot'

  const filter = {
    isAnnouncement: false,
    ...(req.user.role === 'admin' ? {} : { college: req.user.college })
  }

  const total = await Post.countDocuments(filter)

  const now = new Date()
  const sortStageByMode = {
    hot: { hotScore: -1, createdAt: -1 },
    new: { createdAt: -1 },
    top: { likesCount: -1, commentsCount: -1, createdAt: -1 }
  }

  const basePipeline = [
    { $match: filter },
    {
      $addFields: {
        likesCount: { $size: { $ifNull: ['$likes', []] } },
        commentsCount: { $size: { $ifNull: ['$comments', []] } },
        hoursSinceCreated: {
          $divide: [
            { $subtract: [now, '$createdAt'] },
            1000 * 60 * 60
          ]
        }
      }
    },
    {
      $addFields: {
        engagementScore: {
          $add: [
            { $multiply: ['$likesCount', 3] },
            { $multiply: ['$commentsCount', 4] },
            { $min: [{ $divide: [{ $ifNull: ['$views', 0] }, 20] }, 5] }
          ]
        },
        freshnessBoost: {
          $max: [
            { $multiply: [{ $subtract: [36, '$hoursSinceCreated'] }, 0.6] },
            0
          ]
        }
      }
    },
    {
      $addFields: {
        hotScore: {
          $add: ['$engagementScore', '$freshnessBoost']
        }
      }
    },
    { $sort: sortStageByMode[sortMode] }
  ]

  const postsPipeline = isPaginatedRequest
    ? [...basePipeline, { $skip: skip }, { $limit: limit }]
    : basePipeline

  const aggregatedPosts = await Post.aggregate(postsPipeline)
  const posts = await Post.populate(aggregatedPosts, { path: 'owner', select: 'name' })

  const hasMore = skip + posts.length < total

  if (!isPaginatedRequest) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, posts, "Posts fetched successfully")
      )
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, {
      items: posts,
      pagination: {
        page,
        limit,
        sort: sortMode,
        total,
        hasMore,
        nextPage: hasMore ? page + 1 : null
      }
    }, "Posts fetched successfully")
  )
})

const likeAPost = asyncHandler(async(req, res) => {
  const postId = req.params.id;

  const post = await Post.findById(postId)
  if(!post){
    throw new ApiError(401, "Wasnt able to find the Id")
  }
  const alreadyLiked = post.likes.includes(req.user.id)

  const updateLike = await Post.findByIdAndUpdate(
    postId,
    alreadyLiked? { $pull: {likes: req.user.id}} : {$addToSet: {likes: req.user.id}},
    {new: true}
  )

  if(!alreadyLiked && post.owner.toString() !== req.user.id.toString()){
    let snippet = post.title || post.content || 'your post';
    if (snippet.includes('[ATTENDANCE_FLEX]')) {
      snippet = snippet.split('[ATTENDANCE_FLEX]')[0].trim() || 'Shared their attendance stats';
    }
    const notifcation = await createNotification({
      userId: post.owner,
      senderId: req.user.id,
      type: 'like',
      postId: post._id,
      content: snippet.substring(0, 60) + (snippet.length > 60 ? '...' : '')
    })
    return res.status(200).json(new ApiResponse(200, [notifcation, updateLike], "Video was liked successfully"))
  }

  return res.
  status(200)
  .json(new ApiResponse(201, [updateLike], "Video was liked successfully"))
})

const deleteAPost = asyncHandler(async(req, res) => {
  const postId = req.params.id;
  const post = await Post.findById(postId)
  if(!post){
    throw new ApiError(401, "Post Id is not valid")
  }

  const isOwner = post.owner.toString() === req.user.id.toString()
  const isModerator = req.user.role === "moderator"
  const isAdmin = req.user.role === "admin"

  if(!isOwner && !isModerator && !isAdmin){
    throw new ApiError(403, "Not authorized to delete this post")
  }

  const deletedThPost = await Post.findByIdAndDelete(
    postId,
    {new: true}
  )


  return res
  .status(201)
  .json(
    new ApiResponse(201, deletedThPost, "Post was deleted successfully")
  )
})

const getPostById = asyncHandler(async (req, res) => {
  const postId = req.params.id
  if(!postId){
    throw new ApiError(401, "Post Id is neccessarry")
  }
  
  const post = await Post.findByIdAndUpdate(postId, {
    $inc: {views: 1},
  }, {new: true})
    .populate("owner", "name")
    .select("+likes +comments +tags +createdAt +updatedAt")

  if(!post){
    throw new ApiError(404, "Post not found")
  }

  return res
  .status(201)
  .json(
    new ApiResponse(201, post, "Post fetched successfully")
  )
})

const getTrendingPosts = asyncHandler(async (req, res) => {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const posts = await Post.aggregate([
    // $match — filter by college and date
    // $addFields — add likesCount field
    // $sort — sort by likesCount descending

    { $match: { 
      isAnnouncement: false, 
      ...getCollegeFilter(req.user),
      createdAt: { $gte: twentyFourHoursAgo } 
    }},
    { $addFields: { 
      likesCount: { $size: "$likes" } 
    }},
    { $sort: { likesCount: -1 }},
    { $limit: 10 }
  ])


  return res
  .status(200)
  .json(
    new ApiResponse(200, posts, "Trending posts fetched")
  )
})

export {
  createPost,
  getPosts,
  likeAPost,
  deleteAPost,
  getPostById,
  getTrendingPosts
}

