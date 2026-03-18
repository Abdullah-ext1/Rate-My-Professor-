import mongoose, {Schema} from 'mongoose';

const collegeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
  domain: {
    type: String,
    required: true,
  },


}, {timestamps: true});

export const College = mongoose.model('College', collegeSchema);