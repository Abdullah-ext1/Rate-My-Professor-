import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import { User } from "./src/models/users.models.js";
import { DB_NAME } from "./src/db/dbname.js";

async function run() {
  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
  console.log("DB connected");
  
  const user = await User.findOne();
  console.log("User:", user);
  
  process.exit(0);
}
run();
