import jwt from "jsonwebtoken";
import { envConfig } from "../Config/envConfig.js";

export const generateToken = (data,res)=>{
    const token = jwt.sign({_id:data?._id},envConfig?.jwtSecretToken,{expiresIn:"3d"});
    res.cookie("jwt",token,{
        maxAge:24*60*60*1000,
        httpOnly: true,
        sameSite: "strict",
        secure:"false"
    });
    return token;
}