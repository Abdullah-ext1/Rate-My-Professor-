import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.models.js";
import { Post } from "../models/post.models.js";
import { User } from "../models/users.models.js";

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

export {
  createAComment,

}