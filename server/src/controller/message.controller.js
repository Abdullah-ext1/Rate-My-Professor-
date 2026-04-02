import { Message } from "../models/message.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getMessages = asyncHandler(async (req, res) => {
    const messages = await Message.find().populate("sender", "name avatar").sort({ createdAt: -1 }).limit(50);
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                messages,
                "Messages fetched successfully"
            )
        );
})

export {
    getMessages
}