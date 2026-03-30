import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";


const verifyModerator = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'moderator' && req.user.role !== "admin") {
     throw new ApiError(403 ,'Access denied. Moderator/Admin role required.');
  }
  next();
});


export { verifyModerator }