import express from "express";
import cors from "cors";
import { envConfig } from "./Config/envConfig.js";
import { connectDb } from "./Config/dbConnect.js";
import "./utils/passport.js";
import cookieParser from "cookie-parser";
import { authRouter } from "./Routes/auth.route.js";
import { userRouter } from "./Routes/user.route.js";

export const app = express();


/*  middleware for cors */ 
app.use(cors({
    origin:envConfig.backendUrl,
    credentials: true
}));

/* middleware for cookie-parser */
app.use(cookieParser());


/* middleware for json */
app.use(express.json());
app.use(express.urlencoded());

/* Routes */
app.use("/auth",authRouter);
app.use("/user",userRouter);



// Response for api not found
// app.use((req,res)=>{
//     return res.status(404).json({
//         message:`${req.url} is not found`
//     })
// })

connectDb()