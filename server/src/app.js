import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import configurePassport from './middlewares/passport.js';
import authroutes from './routes/auth.routes.js';
import postRoutes from './routes/post.route.js';

const app = express();

configurePassport();

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());


app.use("/api/auth", authroutes)

app.use("/api/posts", postRoutes)

export default app;