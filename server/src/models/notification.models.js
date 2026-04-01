import mongoose, {Schema} from 'mongoose';

const notificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId, 
    ref: 'User', required: true
  },
  type: {
    type: String,
    enum: ['message', 'comment', 'like', 'other'],
    required: true
  },
  commentId: {
    type: Schema.Types.ObjectId, 
    ref: 'Comment'
  },
  postId: {
    type: Schema.Types.ObjectId, 
    ref: 'Post'
  }, 
  content: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {timestamps: true});

notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

export const Notification = mongoose.model('Notification', notificationSchema);