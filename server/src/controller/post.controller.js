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
  const page = Number(req.query.page) || 1    // default to page 1 if not provided
  const limit = Number(req.query.limit) || 10 // default to 10 posts per page if not provided
  const skip = (page - 1) * limit // calculate the number of posts to skip based on the current page and limit

  const filter = req.user.role === 'admin' ? {} : { college: req.user.college }
  const posts = await Post.find(filter).skip(skip).limit(limit)

  return res
  .status(200)
  .json(
    new ApiResponse("200", posts, "Posts fetched successfully")
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

  const notifcation = await createNotification({
    userId: post.owner,
    type: 'like',
    postId: post._id,
    content: 'Someone liked your post'
  })


  return res.
  status(200)
  .json(new ApiResponse(201, [updateLike, notifcation], "Video was liked successfully"))
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

  const postSearch = await Post.findById(postId)
  if(!postSearch){
    throw new ApiError(401, "Post with this Id dosen't exists")
  }
  
  const post = await Post.findByIdAndUpdate(postId, {
    $inc: {views: 1},
  }, {new: true})

  return res
  .status(201)
  .json(
    new ApiResponse(201, post, "View of the post was increemented successfully")
  )
})

const getTrendingPosts = asyncHandler(async (req, res) => {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const posts = await Post.aggregate([
    // $match — filter by college and date
    // $addFields — add likesCount field
    // $sort — sort by likesCount descending

    { $match: { 
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

