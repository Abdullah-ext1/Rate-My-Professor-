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
    content: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export const Message = mongoose.model("Message" , messageSchema )