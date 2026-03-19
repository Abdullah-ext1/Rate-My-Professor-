import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";


const verifyModerator = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'moderator') {
     throw new ApiError(403 ,'Access denied. Moderator role required.');
  }
  next();
});


export { verifyModerator }