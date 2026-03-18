import mongoose, {Schema} from 'mongoose';

const attendanceSchema = new Schema({
  subject: {
    type: String,
    required: true
  },
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
  classAttended: {
    type: Number,
    required: true,
    min: 0
  },
  totalClasses: {
    type: Number,
    required: true,
    min: 1
  }
}, { timestamps: true });

