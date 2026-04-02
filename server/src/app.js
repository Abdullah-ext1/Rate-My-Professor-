import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import configurePassport from './middlewares/passport.js';


const app = express();

configurePassport();

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

export default app;