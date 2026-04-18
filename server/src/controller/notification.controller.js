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
  const page = Math.max(Number(req.query.page) || 1, 1)
  const limit = Math.max(Number(req.query.limit) || 10, 1)
  const skip = (page - 1) * limit

  const filter = { userId: req.user.id }
  const total = await Notification.countDocuments(filter)

  const allNotification = await Notification.find(filter)
    .populate('userId', 'name username')
    .populate('senderId', 'name username')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const hasMore = skip + allNotification.length < total

  return res
  .status(200)
  .json(
    new ApiResponse(200, {
      items: allNotification,
      pagination: {
        page,
        limit,
        total,
        hasMore,
        nextPage: hasMore ? page + 1 : null
      }
    }, "All Notification's fetched successfully")
  )
})


export {
  createNotification,
  markAsRead,
  getAllNotifications,
}