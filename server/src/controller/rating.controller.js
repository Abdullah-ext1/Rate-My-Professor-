import { Rating } from "../models/rating.models";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addRating = asyncHandler(async (req, res) => {

    const { professorId } = req.params

    if (!professorId) {
        throw new ApiError(403, "Invalid Professor")
    }

    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
        throw new ApiError(400, "Rating must be between 1 and 5");
    }
    if (!comment) {
        throw new ApiError(400 , "sach bol de bhaiii")
    }
    
    if (comment.length > 500) {
        throw new ApiError(400, "Comment cannot exceed 500 characters");
    }

    const  alreadyRated = await Rating.findOne({ professor: professorId, user: req.user._id })
        if (alreadyRated) {
            throw new ApiError(400, "You have already rated this professor");
        }
    
    const rate = await Rating.create({
        professor: professorId,
        user: req.user._id,
        rating,
        comment
    })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            rate,
            "Rating added successfully"
        )
    )
})

const getRatings = asyncHandler(async (req, res) => {
    const { professorId } = req.params;

    if (!professorId) {
        throw new ApiError(403, "Invalid Professor");
    }

    const ratings = await Rating.find({ professor: professorId }).populate("user", "name");

    if (ratings.length === 0) {
        throw new ApiError(404, "No ratings found for this professor");
    }
    const averageRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;

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

export {
    addRating,
    getRatings
}