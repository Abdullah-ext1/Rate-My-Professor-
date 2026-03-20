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
    new ApiResponse(201, commentReply, "Reply was created Successfully")
  )
})

export {
  createAComment,
  replyToAComment,
}