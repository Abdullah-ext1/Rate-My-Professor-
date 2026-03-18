import { app } from "./app.js";
import cookieParser from "cookie-parser";

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }, { limit: '16kb' }));

app.use(cookieParser())

app.use(session({
  secret: process.env.SESSION_SECRET || "keyboard cat",
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());


import { Router } from "express";
const router = Router();

