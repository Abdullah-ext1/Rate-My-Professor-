import mongoose, {Schema} from 'mongoose';

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
  },  
  year: {
    type: Number,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator',],
    default: 'user'
  },
  college: {
    type: Schema.Types.ObjectId,
    ref: 'College'
  },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);