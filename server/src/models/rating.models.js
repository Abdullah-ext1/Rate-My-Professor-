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
  comment: {
    type: String,
    default: ''
  }
}, { timestamps: true });


ratingSchema.index({ professor: 1, student: 1 }, { unique: true });

export const Rating = mongoose.model('Rating', ratingSchema);