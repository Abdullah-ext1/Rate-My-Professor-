import mongoose, {Schema} from 'mongoose';

const collegeSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true, 
    index: true
  },
  location: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  website: {
    type: String,
    index: true
  },
  domain: {
    type: String,
    index: true,
    trim: true,
    unique: true
  },


}, {timestamps: true});

collegeSchema.index({ name: 1, location: 1 }, { unique: true });


export const College = mongoose.model('College', collegeSchema);