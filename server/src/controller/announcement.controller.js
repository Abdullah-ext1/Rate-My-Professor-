import { Post } from "../models/post.models";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createAnnouncement = asyncHandler(async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        throw new ApiError(401, "All feilds is Mandatory")
    }

    const annnouncementPost = await Post.create({
        title,
        content,
        owner: req.user._id,
        college: req.user.college,
        isAnnouncement: true
    })

    return res
        .status(201)
        .json(
            new ApiResponse(
                true,
                annnouncementPost,
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
                true,
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

    if (announcement.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this announcement");
    }

    await announcement.remove();

    return res
        .status(200)
        .json(
            new ApiResponse(
                true,
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