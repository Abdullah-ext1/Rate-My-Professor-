import { User } from "../models/users.models.js";
import jwt from 'jsonwebtoken';
import { ApiError } from "../utils/ApiError.js"

const socketAuth = async (socket, next) => {

  try {
    const token = socket.handshake.auth?.token 
      || socket.handshake.headers?.authorization?.replace("Bearer ", "")
      || socket.handshake.headers?.cookie?.split('accessToken=')?.[1]?.split(';')?.[0]
    
    console.log("Socket auth token:", token ? "found" : "not found")
    
    if (!token) {
      throw new ApiError(401, "No authentication token provided")
    }

    const decodeToken = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decodeToken?.id)
    if (!user) {
      throw new ApiError(400, "User Not Found")
    }

    if (user.isBanned && user.bannedUntil > new Date()) {
      throw new ApiError(403, "You are banned until " + user.bannedUntil)
    }

    socket.user = user
    next()
  }
  catch (error) {
    console.error("Socket auth error:", error?.message)
    next(new Error(error?.message || "Wasn't able to verify the token"))
  }
}

export { socketAuth }