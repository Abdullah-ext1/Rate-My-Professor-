import mongoose from 'mongoose';

const professorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  department: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  subjects: {
    type: [String],
    default: [],
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true,
    index: true
  },
  
}, { timestamps: true });

professorSchema.index({ name: 1, college: 1 }, { unique: true }
);


export const Professor = mongoose.model('Professor', professorSchema);  