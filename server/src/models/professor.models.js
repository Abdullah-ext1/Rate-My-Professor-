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
  isApproved: {
    type: Boolean,
    default: false
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  pendingEdits: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  editRequestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
  
}, { timestamps: true });

professorSchema.index({ name: 1, college: 1 }, { unique: true }
);


export const Professor = mongoose.model('Professor', professorSchema);  