import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  avatar: {
    type: String,
    default: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  }, 
  department: {
    type: String,
    required: true
  },  
  year: {
    type: Number,
    required: true
  }, 
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator',],
    default: 'user'
  }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);