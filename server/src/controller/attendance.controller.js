import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { Attendance } from "../models/attendence.models.js";


const addSubject = asyncHandler(async (req, res) => {
    const { professor, subject } = req.body
    if (!professor || !subject) {
        throw new ApiError(403, "Invalid professor")
    }
    const attendance = await Attendance.create({
        user: req.user._id,
        professor,
        subject
    })

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                attendance,
                "Subject added successfully"
            )
        )
})

const markAttendance = asyncHandler(async (req, res) => {
    const { attendanceId } = req.params
    const attendance = await Attendance.findById(attendanceId)
    if (!attendance) {
        throw new ApiError(404, "Attendance record not found")
    }
    if (attendance.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized")
    }
    const { attended } = req.body

    if (attended) {
        attendance.classAttended += 1
        attendance.totalClasses += 1
    } else {
        attendance.classAttended += 0
        attendance.totalClasses += 1
    }

    await attendance.save()
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                attendance,
                "Attendance marked successfully"
            )
        )
})

const getAttendance = asyncHandler(async (req, res) => {
    const attendance = await Attendance.find({ user: req.user._id })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                attendance,
                "Get all Attendance successfully"
            )
        )
})

export {
    addSubject,
    markAttendance,
    getAttendance
}
