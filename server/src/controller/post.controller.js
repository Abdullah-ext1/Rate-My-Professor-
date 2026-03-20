import { User } from "../models/users.models.js";
import { Post } from "../models/post.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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

export {
  createPost,
}
