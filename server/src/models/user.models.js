import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
  },
  year: {
    type: String,
  },
  department: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  college: {
    type: Schema.Types.ObjectId,
    ref: "College",
  },
  role: {
    type: String,
    enum: ["user", "admin", "moderator", "superadmin"],
    default: "user",
  },
}, {timestamps: true});

export const User = mongoose.model("User", userSchema);