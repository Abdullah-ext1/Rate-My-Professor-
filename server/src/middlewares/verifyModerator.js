import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";


const verifyModerator = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'moderator') {
     throw new ApiError(403 ,'Access denied. Moderator role required.');
  }
  next();
});


export { verifyModerator }