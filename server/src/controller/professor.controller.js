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
    let prof;
    try {
        prof = await Professor.create({
            name: name,
            department,
            subjects,
            college: req.user.college,
            addedBy: req.user._id,
            isApproved: req.user.role === 'admin' || req.user.role === 'moderator' ? true : false
        })
    } catch (error) {
        if (error.code === 11000) {
            throw new ApiError(409, "Professor already exists in this college")
        }
        throw new ApiError(500, "Error adding professor: " + error.message)
    }

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
    const limit = Number(req.query.limit) || 1000
    const skip = (page - 1) * limit

    const filter = getCollegeFilter(req.user)
    if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
        // Regular users can see all professors (no approval filter)
        // They just see a filtered view based on their college
    } else {
        if (req.query.isApproved !== undefined) {
            if (req.query.isApproved === 'false') {
                filter.$or = [
                    { isApproved: false },
                    { pendingEdits: { $ne: null } }
                ];
            } else {
                filter.isApproved = true;
            }
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

    const prof = await Professor.findById(professorId);

    if (!prof) {
        throw new ApiError(404, "Professor not found");
    }

    if (isApproved) {
        prof.isApproved = true;
        // Merge pending edits if they exist
        if (prof.pendingEdits) {
            prof.name = prof.pendingEdits.name || prof.name;
            prof.department = prof.pendingEdits.department || prof.department;
            if (prof.pendingEdits.subjects) {
                prof.subjects = prof.pendingEdits.subjects;
            }
            prof.pendingEdits = null;
        }
    } else {
        // Technically "Reject" logic. If we get here, it means we reject something.
        // Wait, currently frontend does DELETE /professors/:id for reject. 
        // If they use PUT with false, we might want to clear pendingEdits without unapproving the prof!
        prof.isApproved = false;
        prof.pendingEdits = null;
    }

    await prof.save();

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

    if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
        // Regular users can see all professors (no approval filter)
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
    
    // Check if it's just discarding a pending edit vs deleting an entire prof
    const prof = await Professor.findById(professorId);
    if (!prof) {
        throw new ApiError(404, "Professor not found")
    }

    if (prof.isApproved && prof.pendingEdits) {
        // Discard the edits, don't delete the whole professor!
        prof.pendingEdits = null;
        prof.editRequestedBy = undefined;
        await prof.save();
        return res.status(200).json(new ApiResponse(200, null, "Professor pending edit rejected successfully"));
    }

    await Professor.findByIdAndDelete(professorId);
    
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

const editProfessorRequest = asyncHandler(async (req, res) => {
    const professorId = req.params.id;
    const { name, department, subjects } = req.body;

    if (!name || !department || !subjects) {
        throw new ApiError(400, "All fields are required");
    }

    const prof = await Professor.findById(professorId);
    if (!prof) {
        throw new ApiError(404, "Professor not found");
    }

    if (req.user.role === 'admin' || req.user.role === 'moderator') {
        prof.name = name;
        prof.department = department;
        prof.subjects = subjects;
        await prof.save();
        return res.status(200).json(new ApiResponse(200, prof, "Professor updated successfully"));
    }

    prof.pendingEdits = {
        name,
        department,
        subjects
    };
    prof.editRequestedBy = req.user._id;

    await prof.save();

    return res.status(200).json(new ApiResponse(200, prof, "Edit request submitted for approval"));
});

export {
    addProfessor,
    getProfessor,
    searchProfessor,
    getProfessorById,
    deleteProfessor,
    moderateProfessor,
    editProfessorRequest
}
