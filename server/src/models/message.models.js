import mongoose, { Schema } from 'mongoose';

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    college: {
        type: Schema.Types.ObjectId,
        ref: "College",
    },
    senderName: { type: String, default: 'Anonymous' },
    content: {
        type: String,
        required: true,
    },
    replyTo: {
        type: Schema.Types.ObjectId,
        ref: "Message",
        default: null,
    },
}, { timestamps: true });

messageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

export const Message = mongoose.model("Message", messageSchema);