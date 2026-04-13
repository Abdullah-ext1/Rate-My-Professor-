import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { Attendance } from "../models/attendance.models.js";

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
    const attendance = await Attendance.find({ user: req.user._id }).populate("professor", "name")

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

const bulkUpdateAttendance = asyncHandler(async (req, res) => {
    const { lecturesAttended, totalLectures } = req.body

    if(!lecturesAttended || !totalLectures) {
        throw new ApiError(400, "Invalid input")
    }

    const attendance = req.params.id

    const attendanceId = await Attendance.findById(attendance)

    if(!attendanceId){
        throw new ApiError (404, "Attendance record not found")
    }

    const bulkAttendance = await Attendance.findByIdAndUpdate(attendance, 
        {
            $set:{
                classAttended: lecturesAttended,
                totalClasses: totalLectures
            },
        }, { new: true }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                bulkAttendance,
                "Bulk update successful"
            )
        )
})

const deleteAttendance = asyncHandler(async (req, res) => {     
    const { attendanceId } = req.params;
    if (!attendanceId) {
        throw new ApiError(403, "Invalid Attendance");
    }
    const attendance = await Attendance.findByIdAndDelete(attendanceId);
    if (!attendance) {
        throw new ApiError(404, "Attendance record not found");
    }
    return res
        .status(200)
        .json(  
            new ApiResponse(
                200,
                null,
                "Attendance record deleted successfully"
            )
        );
})

export {
    addSubject,
    markAttendance,
    getAttendance,
    bulkUpdateAttendance,
    deleteAttendance
}
