import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.models.js";
import { Post } from "../models/post.models.js";
import { createNotification } from "./notification.controller.js";

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

  await Post.findByIdAndUpdate(postId, {
    $push: { comments: createComment._id }
  })

  const createdNotification = await createNotification({
    userId: post.owner,
    type: "comment",
    postId: post._id,
    commentId: createComment._id,
    content: "Somebody commented on your post"
  })
  
  return res
  .status(201)
  .json(
    new ApiResponse(201, [createComment, createdNotification], "Comment created successfully")
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

  const createdNotification = await createNotification({
  userId: comment.user,
  type: "comment",
  commentId: comment.id,
  content: "Somebody replied to your comment"
});

  return res
  .status(201)
  .json(
    new ApiResponse(201, [commentCreate, commentReply, createdNotification], "Reply was created Successfully")
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

  await Post.findByIdAndUpdate(deletedThComment.post, {
    $pull: { comments: commentId }
  })

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

  const comments = await Comment.find({post: postId})
    .populate("user", "name avatar")
    .populate({
      path: "replies",
      populate: { path: "user", select: "name avatar" }
    })

  // Filter out comments that are actually replies to other comments
  const replyIds = new Set();
  comments.forEach(comment => {
    if (comment.replies) {
      comment.replies.forEach(reply => {
        if (reply && reply._id) {
          replyIds.add(reply._id.toString());
        }
      });
    }
  });

  const topLevelComments = comments.filter(comment => !replyIds.has(comment._id.toString()));

  return res
  .status(201)
  .json(
    new ApiResponse(201, topLevelComments, "All comments fetched successfully")
  )
})

const likeAComment = asyncHandler(async (req, res) => {
  const commentId = req.params.id;
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(400, "Comment with that Id doesn't exist");
  }

  const userId = req.user.id;

  const alreadyLiked = comment.commentLike.some(
    (id) => id.toString() === userId.toString()
  );

  const updateLike = await Comment.findByIdAndUpdate(
    commentId,
    alreadyLiked
      ? { $pull: { commentLike: userId } }
      : { $addToSet: { commentLike: userId } },
    { new: true }
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      updateLike,
      alreadyLiked
        ? "Comment unliked successfully"
        : "Comment liked successfully"
    )
  );
});

export {
  createAComment,
  replyToAComment,
  deleteAComment,
  likeAComment,
  getAllCommentsOfAPost,
}