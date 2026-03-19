import mongoose from "mongoose";
import { DB_NAME } from "./dbname.js";

const connectDb = async () => {
    try {
       const connection =  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDb connected !! ${connection.connection.host}`);
        
    } catch (error) {
        console.log("Error : MONGODB CONNECTION ERROR!!" , error)
        process.exit(1)
    }
}

export {connectDb}