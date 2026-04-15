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

const createMessage = asyncHandler(async (req, res) => {
    const message = await Message.create({
        sender: req.user._id,
        college: req.user.college,
        content: req.body.content,
    });
    
    const populatedMessage = await message.populate("sender", "name avatar _id");

    const io = req.app.get('io');
    if (io) {
        io.emit("message", populatedMessage);
    }
    
    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                populatedMessage,
                "Message sent successfully"
            )
        );
});

export {
    getMessages,
    createMessage
}