import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";


const verifyAdmin = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin") {
     throw new ApiError(403 ,'Access denied. Admin role required.');
  }
  next();
});


export { verifyAdmin }