import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Rating } from "../models/rating.models.js";

const getLeaderboard = asyncHandler(async (req, res) => {
    const leaderboard = await Rating.aggregate([
        {
            $lookup: {
                from: "professors",
                localField: "professor",
                foreignField: "_id",
                as: "professorDetails"
            }
        },
        {
            $match: {
                "professorDetails.college": new mongoose.Types.ObjectId(req.user.college)
            }
        },
        {
            $group: {
                _id: "$professor",
                averageRating: { $avg: "$rating" },
                totalRatings: { $sum: 1 },
                professorDetails: { $first: "$professorDetails" }
            }
        },
        {
            $sort: { averageRating: -1 }
        },
        {
            $limit: 10
        }

    ])

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                leaderboard,
                "Leaderboard fetched successfully"
            )
        )   
})
export {
    getLeaderboard
}