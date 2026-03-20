import { Professor } from "../models/professor.models.js";
import {ApiError} from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";

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

    const professor = await Professor.find({ college: req.user.college }).skip(skip).limit(limit)

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

export {
    addProfessor,
    getProfessor

}