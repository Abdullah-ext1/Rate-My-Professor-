import mongoose from 'mongoose';

const professorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  subjects: {
    type: [String],
    default: [],
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true
  },
  
}, { timestamps: true });

export const Professor = mongoose.model('Professor', professorSchema);  