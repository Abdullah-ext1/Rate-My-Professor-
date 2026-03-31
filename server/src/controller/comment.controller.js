import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.models.js";
import { Post } from "../models/post.models.js";

const createAComment = asyncHandler(async(req, res) => {
  const postId = req.params.postId;
  const {content} = req.body; // remember to deststructure

  if(content.length == 0){
    throw new ApiError(401, "Comment is necessary to make comment")
  }

  const post = await Post.findById(postId)
  if(!post){
    throw new ApiError(401, "Post doesn't exists")
  }

  const createComment = await Comment.create({
    user: req.user.id,
    post: postId,
    content,
  })
  
  return res
  .status(201)
  .json(
    new ApiResponse(201, createComment, "Comment created successfully")
  )
}) 

const replyToAComment = asyncHandler(async(req, res) => {
  const commentId = req.params.commentId
  const { content } = req.body

  if(content.length == 0){
    throw new ApiError(401, "Comment is neccesarry to make a comment")
  }

  const comment = await Comment.findById(commentId)
  if(!comment){
    throw new ApiError(404, "Comment not found")
  } 

  const commentCreate = await Comment.create({
    post: comment.post,
    content,
    user: req.user.id
  })

  const commentReply = await Comment.findByIdAndUpdate(
    commentId,
    {
      $push: { replies: commentCreate._id }
    },
    { new: true }
    )

  return res
  .status(201)
  .json(
    new ApiResponse(201, [commentCreate, commentReply], "Reply was created Successfully")
  )
})

const deleteAComment = asyncHandler(async(req, res) => {
  const commentId = req.params.id
  const comment = await Comment.findById(commentId)

  if(!comment){
    throw new ApiError(401, "Comment wasn't found")
  }

  const isOwner = comment.user.toString() === req.user.id.toString()
  const isModerator = req.user.role === "moderator"
  const isAdmin = req.user.role === "admin"

  if(!isOwner && !isModerator && !isAdmin){
    throw new ApiError(403, "Not authorized to delete this post")
  }

  const deletedThComment = await Comment.findByIdAndDelete(
    commentId,
    {new: true}
  )

  return res
  .status(201)
  .json(
    new ApiResponse(201, deletedThComment, "Deleted the comment sucessfully")
  )
})

const getAllCommentsOfAPost = asyncHandler(async (req, res) => {
  const postId = req.params.id
  const post = await Post.findById(postId)

  if(!post){
    throw new ApiError(400, "Post with that Id dosen't exists")
  }

  // populate takes the field name as first argument and selected fields as second argument. But you're passing "name" and "avatar" as two separate arguments.

  const comment = await Comment.find({post: postId}).populate("user", "name avatar").populate("replies").populate("commentLike")

  return res
  .status(201)
  .json(
    new ApiResponse(201, comment, "All comments fetched successfully")
  )
})

const likeAComment = asyncHandler(async(req, res) => {
  const commentId = req.params.id
  const comment = await Comment.findById(commentId)

  if(!comment){
    throw new ApiError(400, "Comment with that Id dosen't exists")
  }

  const alreadyLiked = comment.commentLike.includes(req.user.id)

  const updateLike = await Comment.findByIdAndUpdate(
    commentId,
    alreadyLiked? 
      { 
        $pull: {commentLike: req.user.id}
      } : 
      {
        $addToSet: {commentLike: req.user.id}
      },
      {new: true}
  )

  return res
  .status(201)
  .json(
    new ApiResponse(201, updateLike, alreadyLiked? "Comment was unliked successfully" : "Comment was liked successfully")
  )
})

export {
  createAComment,
  replyToAComment,
  deleteAComment,
  likeAComment,
  getAllCommentsOfAPost,
}