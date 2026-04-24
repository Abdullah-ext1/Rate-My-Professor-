import { Message } from "../models/message.models.js";
import { User } from "../models/users.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getMessages = asyncHandler(async (req, res) => {
    const messages = await Message.find()
        .populate("sender", "name avatar role username")
        .populate("replyTo", "senderName content")
        .sort({ createdAt: -1 })
        .limit(50);
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
        senderName: req.body.senderName || 'Anonymous',
        replyTo: req.body.replyTo || null,
    });
    
    const populatedMessage = await message.populate([
        { path: "sender", select: "name avatar role username _id" },
        { path: "replyTo", select: "senderName content" }
    ]);

    const io = req.app.get('io');
    if (io) {
        io.emit("message", populatedMessage);
    }
    
    // Broadcast push notification
    import('./notification.controller.js').then(({ sendPushNotification }) => {
        sendPushNotification({
            title: `New chat from ${populatedMessage.senderName || 'Anonymous'}`,
            body: populatedMessage.content?.includes('attendance') ? 'Attendance Flex Stats' : populatedMessage.content,
            url: '/chat'
        }, { excludeUserId: req.user._id });
    }).catch(err => console.error("Failed to load push notification sender", err));

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

const deleteMessage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const message = await Message.findById(id);
    if (!message) {
        throw new ApiError(404, "Message not found");
    }
    
    if (req.user.role !== 'admin' && req.user.role !== 'moderator' && message.sender.toString() !== req.user._id.toString()) {
        return res.status(403).json(new ApiResponse(403, null, "Not authorized to delete messages"));
    }

    await Message.findByIdAndDelete(id);

    const io = req.app.get('io');
    if (io) {
        io.emit("messageDeleted", id);
    }

    return res.status(200).json(new ApiResponse(200, null, "Message deleted successfully"));
});

const getTargetUserByMessageId = async (messageId) => {
    const message = await Message.findById(messageId).populate("sender", "_id role name");
    if (!message) {
        throw new ApiError(404, "Message not found");
    }

    if (!message.sender?._id) {
        throw new ApiError(404, "Message sender not found");
    }

    return { message, targetUser: message.sender };
};

const suspendMessageSender = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
        throw new ApiError(403, "Not authorized to suspend users");
    }

    const { targetUser } = await getTargetUserByMessageId(id);

    if (targetUser.role === 'admin' || targetUser.role === 'moderator') {
        throw new ApiError(403, "Cannot suspend moderator/admin users from chat");
    }

    const suspendedUser = await User.findByIdAndUpdate(
        targetUser._id,
        {
            isBanned: true,
            bannedUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        },
        { new: true }
    );

    return res.status(200).json(new ApiResponse(200, suspendedUser, "User suspended for 14 days successfully"));
});

const banMessageSender = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
        throw new ApiError(403, "Only admins can permanently ban users");
    }

    const { targetUser } = await getTargetUserByMessageId(id);

    if (targetUser.role === 'admin') {
        throw new ApiError(403, "Cannot ban another admin");
    }

    const bannedUser = await User.findByIdAndUpdate(
        targetUser._id,
        {
            isBanned: true,
            bannedUntil: null
        },
        { new: true }
    );

    return res.status(200).json(new ApiResponse(200, bannedUser, "User permanently banned successfully"));
});

const promoteMessageSenderToModerator = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
        throw new ApiError(403, "Only admins can promote moderators");
    }

    const { targetUser } = await getTargetUserByMessageId(id);

    if (targetUser.role === 'admin') {
        throw new ApiError(403, "Cannot change admin role");
    }

    const updatedUser = await User.findByIdAndUpdate(
        targetUser._id,
        { role: 'moderator' },
        { new: true }
    );

    import('./notification.controller.js').then(({ createNotification }) => {
        createNotification({
            userId: targetUser._id,
            senderId: req.user._id,
            type: 'other',
            content: 'You have been promoted to Moderator.'
        });
    });

    return res.status(200).json(new ApiResponse(200, updatedUser, "User promoted to moderator successfully"));
});

const demoteMessageSenderFromModerator = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
        throw new ApiError(403, "Only admins can remove moderator role");
    }

    const { targetUser } = await getTargetUserByMessageId(id);

    if (targetUser.role === 'admin') {
        throw new ApiError(403, "Cannot change admin role");
    }

    const updatedUser = await User.findByIdAndUpdate(
        targetUser._id,
        { role: 'user' },
        { new: true }
    );

    import('./notification.controller.js').then(({ createNotification }) => {
        createNotification({
            userId: targetUser._id,
            senderId: req.user._id,
            type: 'other',
            content: 'Your moderator privileges have been removed.'
        });
    });

    return res.status(200).json(new ApiResponse(200, updatedUser, "Moderator role removed successfully"));
});

const reportMessage = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { message } = await getTargetUserByMessageId(id);

    if (message.sender._id.toString() === req.user._id.toString()) {
        throw new ApiError(400, "You cannot report your own message");
    }

    // Find all admins and moderators
    const adminsAndMods = await User.find({ role: { $in: ['admin', 'moderator'] } });
    
    import('./notification.controller.js').then(({ createNotification }) => {
        adminsAndMods.forEach(admin => {
            createNotification({
                userId: admin._id,
                senderId: req.user._id,
                type: 'other',
                content: `A chat message by ${message.senderName || 'Anonymous'} was reported: "${message.content?.substring(0, 50)}..."`
            });
        });
    });

    return res.status(200).json(new ApiResponse(200, null, "Message reported successfully"));
});

export {
    getMessages,
    createMessage,
    deleteMessage,
    suspendMessageSender,
    banMessageSender,
    promoteMessageSenderToModerator,
    demoteMessageSenderFromModerator,
    reportMessage
}