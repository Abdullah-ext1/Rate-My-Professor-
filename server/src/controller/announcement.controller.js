import { Post } from "../models/post.models.js";
import { User } from "../models/users.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createNotification } from "./notification.controller.js";

const createAnnouncement = asyncHandler(async (req, res) => {
    const { title, content, announcementType } = req.body;

    if (!title || !content || !announcementType) {
        throw new ApiError(400, "All feilds is Mandatory")
    }

    const annnouncementPost = await Post.create({
        title,
        content,
        owner: req.user._id,
        college: req.user.college,
        isAnnouncement: true,
        announcementType
    })

    const users = await User.find({ college: req.user.college })

    const promise = users.map(user => createNotification({
        userId: user._id,
        senderId: req.user.id,
        type: 'announcement',
        content: 'Alert! An announcement has been made',
        announcementType
    }))

    await Promise.all(promise)

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                [annnouncementPost],
                "Announcement created successfully"
            )
        )
})

const getAllAnnouncements = asyncHandler(async (req, res) => {
    const announcements = await Post
    .find({ college: req.user.college, isAnnouncement: true })
    .populate("owner", "name").sort({ createdAt: -1 });

    return res
        .status(200)
        .json(
            new ApiResponse(    
                200,
                announcements,
                "Announcements fetched successfully"
            )
        )
})

const deleteAnnouncement = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const announcement = await Post.findOne({ _id: id, isAnnouncement: true });

    if (!announcement) {
        throw new ApiError(404, "Announcement not found");
    }

    const isOwner = announcement.owner.toString() === req.user.id.toString()
    const isModerator = req.user.role === "moderator"
    const isAdmin = req.user.role === "admin"

    if(!isOwner && !isModerator && !isAdmin){
        throw new ApiError(403, "Not authorized to delete this post")
    }

    await announcement.deleteOne();

    return res
        .status(200)
        .json(
            new ApiResponse(
                201,
                null,
                "Announcement deleted successfully"
            )

        )
})

export {
    createAnnouncement,
    getAllAnnouncements,
    deleteAnnouncement
}