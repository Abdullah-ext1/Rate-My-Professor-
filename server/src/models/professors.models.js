import mongoose from 'mongoose';

const professorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  
}, { timestamps: true });

export const Professor = mongoose.model('Professor', professorSchema);  