import { Professor } from "../models/professor.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getCollegeFilter } from "../utils/collegeFilter.js";

const addProfessor = asyncHandler(async (req, res) => {
    const { name, department, subjects } = req.body

    if (!name || !department || !subjects) {
        throw new ApiError(400, "All Feilds Are Required")
    }
    const prof = await Professor.create({
        name: name,
        department,
        subjects,
        college: req.user.college,
        addedBy: req.user._id,
        isApproved: req.user.role === 'admin' ? true : false
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { prof },
                "Professor Added Successfully"

            )
        )
})

const getProfessor = asyncHandler(async (req, res) => {

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    const filter = getCollegeFilter(req.user)
    if (req.user.role !== 'admin') {
        filter.isApproved = true;
    } else {
        if (req.query.isApproved !== undefined) {
            filter.isApproved = req.query.isApproved === 'true';
        }
    }

    const professor = await Professor.aggregate([
        { $match: filter },
        {
            $lookup: {
                from: "ratings",
                localField: "_id",
                foreignField: "professor",
                as: "ratings"
            }
        },
        {
            $addFields: {
                averageRating: {
                    $cond: {
                        if: { $gt: [{ $size: "$ratings" }, 0] },
                        then: { $avg: "$ratings.rating" },
                        else: 0
                    }
                },
                totalReviews: { $size: "$ratings" }
            }
        },
        {
            $project: {
                ratings: 0
            }
        },
        { $skip: skip },
        { $limit: limit }
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                professor,
                "get all professor successfully"
            )
        )
})

const moderateProfessor = asyncHandler(async (req, res) => {
    const professorId = req.params.id;
    const { isApproved } = req.body;

    if (isApproved === undefined) {
        throw new ApiError(400, "isApproved field is required");
    }

    const prof = await Professor.findByIdAndUpdate(
        professorId,
        { $set: { isApproved } },
        { new: true }
    );

    if (!prof) {
        throw new ApiError(404, "Professor not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                prof,
                "Professor moderated successfully"
            )
        );
})

const getProfessorById = asyncHandler(async (req, res) => {
    const professorId = req.params.id

    if (!professorId) {
        throw new ApiError(400, "Professor Id is required")
    }

    const professor = await Professor.findById(professorId)

    if (!professor) {
        throw new ApiError(404, "Professor not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                professor,
                "Professor fetched successfully"
            )
        )
})

const searchProfessor = asyncHandler(async (req, res) => {
    const { name } = req.query

    if (!name) {
        throw new ApiError(403, "Professor Not found")
    }

    const filter = {
        name: { $regex: name, $options: "i" },
        ...getCollegeFilter(req.user)
    }

    if (req.user.role !== 'admin') {
        filter.isApproved = true;
    } else {
        if (req.query.isApproved !== undefined) {
            filter.isApproved = req.query.isApproved === 'true';
        }
    }

    const search = await Professor.aggregate([
        { $match: filter },
        {
            $lookup: {
                from: "ratings",
                localField: "_id",
                foreignField: "professor",
                as: "ratings"
            }
        },
        {
            $addFields: {
                averageRating: {
                    $cond: {
                        if: { $gt: [{ $size: "$ratings" }, 0] },
                        then: { $avg: "$ratings.rating" },
                        else: 0
                    }
                },
                totalReviews: { $size: "$ratings" }
            }
        },
        {
            $project: {
                ratings: 0
            }
        }
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                search,
                "Search results fetched successfully"
            )
        )
})

const deleteProfessor = asyncHandler(async (req, res) => {
    const professorId = req.params.id
    if (!professorId) {
        throw new ApiError(403, "Professor Id is required")
    }
    const professor = await Professor.findByIdAndDelete(professorId)
    if (!professor) {
        throw new ApiError(404, "Professor not found")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Professor deleted successfully"
            )
        );
})

export {
    addProfessor,
    getProfessor,
    searchProfessor,
    getProfessorById,
    deleteProfessor,
    moderateProfessor
}
