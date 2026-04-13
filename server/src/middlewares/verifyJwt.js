import { User } from "../models/users.models.js";
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from "../utils/ApiError.js"

const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      throw new ApiError(401, "No authentication token provided. Please login.");
    }

    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decodeToken?.id);

    if (!user) {
      throw new ApiError(401, "User not found. Please login again.");
    }

    if (user.isBanned && user.bannedUntil > new Date()) {
      throw new ApiError(403, "You are banned until " + user.bannedUntil);
    }

    req.user = user;
    next();
  } catch (error) {
    // If it's already an ApiError, pass it along
    if (error instanceof ApiError) {
      throw error;
    }
    // Otherwise, wrap it
    throw new ApiError(401, error?.message || "Invalid authentication token");
  }
});

export { verifyJwt }