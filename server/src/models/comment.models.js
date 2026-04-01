import mongoose, {Schema} from 'mongoose';

const commentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  replies: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: "Comment",
    }],
    default: [],
  },
  commentLike: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: "User"
    }]
  }
}, {timestamps: true});

commentSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

export const Comment = mongoose.model("Comment", commentSchema);