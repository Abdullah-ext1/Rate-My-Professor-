import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Notification } from "../models/notification.models.js";

const createNotification = async ({ userId, type, postId, commentId, content }) => {
  await Notification.create({
    userId,
    type,
    postId,
    commentId,
    content
  })
}


export {
  createNotification
}