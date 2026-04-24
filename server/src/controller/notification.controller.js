import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Notification } from "../models/notification.models.js";
import { Subscription } from "../models/subscription.models.js";
import { getIo } from "../socket/io.store.js";
import webpush from "../utils/webPush.js";

const createNotification = async ({ userId, senderId, type, postId, commentId, content }) => {
  const notification = await Notification.create({
    userId,
    senderId,
    type,
    postId,
    commentId,
    content
  })

  const io = getIo();
  if (io && userId) {
    io.to(`user:${userId.toString()}`).emit('notification', {
      _id: notification._id,
      userId,
      senderId,
      type,
      postId,
      commentId,
      content,
      createdAt: notification.createdAt,
      isRead: notification.isRead
    });
  }

  if (userId && (!senderId || userId.toString() !== senderId.toString())) {
    sendPushNotification({
      title: 'campus.',
      body: content,
      url: '/'
    }, { userId: userId }).catch(err => console.error("Push error:", err));
  }

  return notification;
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
  const isPaginatedRequest = req.query.page !== undefined || req.query.limit !== undefined
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

  if (!isPaginatedRequest) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, allNotification, "All Notification's fetched successfully")
      )
  }

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

const getUnreadCount = asyncHandler(async(req, res) => {
  const unreadCount = await Notification.countDocuments({
    userId: req.user._id,
    isRead: false
  })

  return res.status(200).json(
    new ApiResponse(200, unreadCount, "Unread count fetched successfully")
  )
})

const subscribePush = asyncHandler(async (req, res) => {
  const subscription = req.body;

  if (!subscription || !subscription.endpoint) {
    throw new ApiError(400, "Invalid subscription object");
  }

  // Save or update subscription
  await Subscription.findOneAndUpdate(
    { endpoint: subscription.endpoint },
    {
      user: req.user._id,
      endpoint: subscription.endpoint,
      keys: subscription.keys,
    },
    { upsert: true, new: true }
  );

  return res.status(201).json(new ApiResponse(201, null, "Push subscription saved"));
});

// Helper to broadcast or target push notification
const sendPushNotification = async (payload, options = {}) => {
  try {
    const { excludeUserId, userId, userIds } = options;
    let query = {};
    
    if (userId) {
      query = { user: userId };
    } else if (userIds && Array.isArray(userIds)) {
      query = { user: { $in: userIds } };
    } else if (excludeUserId) {
      query = { user: { $ne: excludeUserId } };
    }
    
    const subscriptions = await Subscription.find(query);

    const promises = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: sub.keys,
          },
          JSON.stringify(payload)
        );
      } catch (err) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          console.log("Subscription has expired or is no longer valid: ", err);
          await Subscription.findByIdAndDelete(sub._id);
        } else {
          console.error("Error sending push notification: ", err);
        }
      }
    });

    await Promise.all(promises);
  } catch (error) {
    console.error("Error broadcasting push notifications:", error);
  }
};

export {
  createNotification,
  markAsRead,
  getAllNotifications,
  getUnreadCount,
  subscribePush,
  sendPushNotification
}