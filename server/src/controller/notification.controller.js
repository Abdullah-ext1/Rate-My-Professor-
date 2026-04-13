import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Notification } from "../models/notification.models.js";

const createNotification = async ({ userId, senderId, type, postId, commentId, content }) => {
  await Notification.create({
    userId,
    senderId,
    type,
    postId,
    commentId,
    content
  })
}

const markAsRead = asyncHandler(async (req, res) => {
  const notificationId = req.params.id
  if(!notificationId){
    throw new ApiError(401, "Notification id was not given")
  }

  const notificationSearch = await Notification.findById(notificationId)

  if(!notificationSearch){
    throw new ApiError(401, "Notification Id was invalid")
  }
  const notification = await Notification.findByIdAndUpdate(notificationId, {
    $set: {
      isRead: true
    }
  }, {new: true})

  return res
  .status(201)
  .json(
    new ApiResponse(201, notification, "Notification was read successfully")
  )
})

const getAllNotifications = asyncHandler(async (req, res) => {
  const allNotification = await Notification.find({userId :req.user.id}).populate('userId', 'name username').populate('senderId', 'name username').sort({createdAt: -1})

  return res
  .status(201)
  .json(
    new ApiResponse(201, allNotification, "All Notification's fetched successfully")
  )
})


export {
  createNotification,
  markAsRead,
  getAllNotifications,
}