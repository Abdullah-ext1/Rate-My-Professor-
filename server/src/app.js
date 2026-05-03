import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import configurePassport from './middlewares/passport.js';
import cors from "cors";


const app = express();

configurePassport();

app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        process.env.CORS,
        process.env.FRONTEND_URL,
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:3000',
        'https://campus-three-black.vercel.app',
      ].filter(Boolean);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for dev — tighten in production if needed
      }
    },
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());


//routes import
import authroutes from './routes/auth.routes.js';
import postRoutes from './routes/post.routes.js';
import professorRoutes from './routes/professor.routes.js';
import commentRoutes from "./routes/comment.routes.js"
import ratingRoutes from "./routes/rating.routes.js"
import attendanceRoutes from "./routes/attendance.routes.js"
import collegeRoutes from "./routes/college.routes.js"
import notificationRoutes from "./routes/notification.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import announcementRoutes from "./routes/announcement.routes.js";
import pyqsRoutes from "./routes/pyqs.routes.js"
import messageRoutes from "./routes/message.routes.js"
import healthRoutes from "./routes/health.routes.js"

//routes use
app.use("/api/auth", authroutes)
app.use("/api/posts", postRoutes)
app.use("/api/professor" , professorRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/ratings", ratingRoutes)
app.use("/api/attendance", attendanceRoutes)
app.use("/api/colleges", collegeRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/leaderboard", leaderboardRoutes)
app.use("/api/announcements", announcementRoutes)
app.use("/api/pyqs", pyqsRoutes)
app.use("/api/messages", messageRoutes)     
app.use("/health", healthRoutes)

export default app;