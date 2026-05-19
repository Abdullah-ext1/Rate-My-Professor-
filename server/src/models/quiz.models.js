import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema({
  type: {
    type: String,
    enum: ['mcq', 'one-word', 'short-answer'],
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    default: []
  },
  correctAnswer: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    default: ''
  }
}, { _id: false });

const quizSchema = new Schema({
  pyqId: {
    type: Schema.Types.ObjectId,
    ref: 'PYQ',
    default: null
  },
  subjectName: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  questions: {
    type: [questionSchema],
    required: true
  },
  sourceContent: {
    type: String,
    default: ''
  },
  generatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
},
  { timestamps: true }
);

export const Quiz = mongoose.model('Quiz', quizSchema);
