import mongoose, {Schema} from 'mongoose';

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
    enum: ["general", "resources", "discussions", "coding", "professor", "rant", 'other'],
  },
  comments:{
    type: [{
      type: Schema.Types.ObjectId,
      ref: "Comment",
    }],
    default: [],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  college: {
    type: Schema.Types.ObjectId,
    ref: "College",
    required: true,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }],
}, {timestamps: true});

export const Post = mongoose.model("Post", postSchema);