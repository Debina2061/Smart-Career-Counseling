import mongoose from "mongoose";
import { envConfig } from "./envConfig.js";
export const connectDb = async()=>{
    try {
        await mongoose.connect(envConfig.mongoUrl).then(()=>{
            console.log(`Database connected`)
        });
    } catch (error) {
        console.error(`Error at Database connection:${error?.message}`)
    }
}