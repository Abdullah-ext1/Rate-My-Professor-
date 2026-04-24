import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        endpoint: {
            type: String,
            required: true,
            unique: true,
        },
        keys: {
            p256dh: String,
            auth: String,
        },
    },
    { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
