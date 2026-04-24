import mongoose, {Schema} from 'mongoose';

const ratingSchema = new Schema({
  professor: {
    type: Schema.Types.ObjectId,
    ref: 'Professor',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  tags: {
    type: [String],
    default: []
  },
  comment: {
    type: String,
    default: ''
  },
  helpfulVotes: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  unhelpfulVotes: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: []
  }
}, { timestamps: true });


ratingSchema.index({ professor: 1, user: 1 }, { unique: true });

export const Rating = mongoose.model('Rating', ratingSchema);