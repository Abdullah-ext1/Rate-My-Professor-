import mongoose, {Schema} from "mongoose";

const pyqsSchema = new Schema({
  subjectName: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  questionPaperUrl: {
    type: String,
    required: true
  },
  examType: {
    type: String,
    enum: ["End Semester", "Mid Semester", "Internal1", "Internal2", "Notes", "Other"],
    required: true
  },
  college: {
    type: Schema.Types.ObjectId,
    ref: 'College',
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, 
  {timestamps: true}
)

export const PYQ = mongoose.model('PYQ', pyqsSchema);