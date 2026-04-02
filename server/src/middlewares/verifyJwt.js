import { User } from "../models/users.models.js";
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from "../utils/ApiError.js"

const verifyJwt = asyncHandler( async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    if(!token){
      throw new ApiError(401, "Token generation was unsucessfull")
    }

    const decodeToken = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decodeToken?.id)

    if(!user){
      throw new ApiError(401,  "Invalid Access token")
    }

    if(user.isBanned && user.bannedUntil > new Date()){
      throw new ApiError(403, "You are banned until " + user.bannedUntil)
    }

    req.user = user; // attaches user to request
    next(); // let request move forward from the middleware
  } catch (error) {
    throw new ApiError(401, error?.message || "Wasnt able to verify the token")
  }
})

export { verifyJwt }