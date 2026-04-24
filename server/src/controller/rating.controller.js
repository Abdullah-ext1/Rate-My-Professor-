import {Rating} from "../models/rating.models.js"
import { Professor } from "../models/professor.models.js";
import { createNotification } from "./notification.controller.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addRating = asyncHandler(async (req, res) => {

    const { professorId } = req.params

    if (!professorId) {
        throw new ApiError(403, "Invalid Professor")
    }

    const { rating, comment, tags = [], difficulty = 3 } = req.body;
    if (!rating || rating < 1 || rating > 5) {
        throw new ApiError(400, "Rating must be between 1 and 5");
    }
    if (!comment) {
        throw new ApiError(400 , "sach bol de bhaiii")
    }
    
    if (comment.length > 500) {
        throw new ApiError(400, "Comment cannot exceed 500 characters");
    }

    const existingRating = await Rating.findOne({ professor: professorId, user: req.user._id })

    let rate;
    const safeDifficulty = Math.max(1, Math.min(5, Number(difficulty) || 3));
    if (existingRating) {
        existingRating.rating = rating;
        existingRating.comment = comment;
        existingRating.tags = Array.isArray(tags) ? tags.slice(0, 3) : [];
        existingRating.difficulty = safeDifficulty;
        rate = await existingRating.save();
    } else {
        rate = await Rating.create({
            professor: professorId,
            user: req.user._id,
            rating,
            comment,
            difficulty: safeDifficulty,
            tags: Array.isArray(tags) ? tags.slice(0, 3) : []
        })
    }

    const professor = await Professor.findById(professorId).select("name addedBy")
    if (professor?.addedBy && professor.addedBy.toString() !== req.user._id.toString()) {
        await createNotification({
            userId: professor.addedBy,
            senderId: req.user._id,
            type: 'other',
            content: `New review on ${professor.name}`
        })
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            rate,
            existingRating ? "Rating updated successfully" : "Rating added successfully"
        )
    )
})

const getRatings = asyncHandler(async (req, res) => {
    const { professorId } = req.params;

    if (!professorId) {
        throw new ApiError(403, "Invalid Professor");
    }

    const ratings = await Rating.find({ professor: professorId }).populate("user", "name");

    const averageRating = ratings.length > 0 ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length : 0
    
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { ratings, averageRating }, 
                "Ratings fetched successfully"
            )
        );
});

const voteOnRating = asyncHandler(async (req, res) => {
    const { ratingId } = req.params;
    const { voteType } = req.body;

    if (!ratingId) {
        throw new ApiError(403, "Invalid Rating");
    }

    if (!['helpful', 'unhelpful'].includes(voteType)) {
        throw new ApiError(400, "voteType must be 'helpful' or 'unhelpful'");
    }

    const rating = await Rating.findById(ratingId);

    if (!rating) {
        throw new ApiError(404, "Rating not found");
    }

    const userId = req.user._id.toString();
    const helpfulSet = new Set(rating.helpfulVotes.map((id) => id.toString()));
    const unhelpfulSet = new Set(rating.unhelpfulVotes.map((id) => id.toString()));

    if (voteType === 'helpful') {
        if (helpfulSet.has(userId)) {
            helpfulSet.delete(userId);
        } else {
            helpfulSet.add(userId);
            unhelpfulSet.delete(userId);
        }
    } else {
        if (unhelpfulSet.has(userId)) {
            unhelpfulSet.delete(userId);
        } else {
            unhelpfulSet.add(userId);
            helpfulSet.delete(userId);
        }
    }

    rating.helpfulVotes = Array.from(helpfulSet);
    rating.unhelpfulVotes = Array.from(unhelpfulSet);
    await rating.save();

    if (voteType === 'helpful' && helpfulSet.has(userId) && rating.user.toString() !== userId) {
        const rawPreview = rating.comment || 'your review';
        const ratingPreview = rawPreview.substring(0, 60);
        await createNotification({
            userId: rating.user,
            senderId: req.user._id,
            type: 'like',
            content: `Someone found your professor review helpful: "${ratingPreview}${rawPreview.length > 60 ? '...' : ''}"`
        })
    }

    return res.status(200).json(
        new ApiResponse(200, {
            ratingId: rating._id,
            helpful: rating.helpfulVotes.length,
            unhelpful: rating.unhelpfulVotes.length,
            userVote: helpfulSet.has(userId) ? 'helpful' : unhelpfulSet.has(userId) ? 'unhelpful' : null
        }, "Vote updated successfully")
    )
})

const deleteRating = asyncHandler(async (req, res) => {
    const { ratingId } = req.params;    
    if (!ratingId) {
        throw new ApiError(403, "Invalid Rating");
    }
    const rating = await Rating.findByIdAndDelete(ratingId);
    if (!rating) {
        throw new ApiError(404, "Rating not found");
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Rating deleted successfully"
            )
        );
});


export {
    addRating,
    getRatings,
    deleteRating,
    voteOnRating
}