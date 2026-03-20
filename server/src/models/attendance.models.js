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
    default: 0,
    min: 0
  },
  totalClasses: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  }
}, { timestamps: true ,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

attendanceSchema.virtual("bunkmeter").get(function() {
  const bunksLeft = Math.floor(this.classAttended - (this.totalClasses * 0.75))
  return bunksLeft
})

export const Attendance = mongoose.model('Attendance', attendanceSchema);

const calculateBunk = new Attendance({totalClasses: 100, classAttended: 82});
console.log(calculateBunk.bunkmeter);