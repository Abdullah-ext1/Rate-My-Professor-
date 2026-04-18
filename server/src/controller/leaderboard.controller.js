import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Rating } from "../models/rating.models.js";
import { getCollegeFilter } from "../utils/collegeFilter.js";
import mongoose from "mongoose";

const getLeaderboard = asyncHandler(async (req, res) => {
    const filter = getCollegeFilter(req.user);
    const matchFilter = {};
    if (filter.college) {
        matchFilter["professorDetails.college"] = new mongoose.Types.ObjectId(filter.college);
    }
    
    // Remove the approval filter so that all users can see all professors
    // since regular users can see unapproved professors on the Feed as well.

    const leaderboard = await Rating.aggregate([
        {
            $lookup: {
                from: "professors",
                localField: "professor",
                foreignField: "_id",
                as: "professorDetails"
            }
        },
        { $unwind: "$professorDetails" },
        {
            $match: matchFilter
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

    // Format the response structure to wrap professorDetails in an array 
    // to match the frontend's expectation: item.professorDetails[0]?.name
    const formattedLeaderboard = leaderboard.map(item => ({
        ...item,
        professorDetails: [item.professorDetails]
    }));

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                formattedLeaderboard,
                "Leaderboard fetched successfully"
            )
        )   
})
export {
    getLeaderboard
}