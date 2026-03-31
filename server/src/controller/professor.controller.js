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
        college: req.user.college
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

    const professor = await Professor.find(getCollegeFilter(req.user)).skip(skip).limit(limit)

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

    const search = await Professor.find({
        name: { $regex: name, $options: "i" },
        ...getCollegeFilter(req.user)
    }).select("name department subjects")



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
    deleteProfessor
}
