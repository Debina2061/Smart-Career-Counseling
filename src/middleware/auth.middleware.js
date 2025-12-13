import jwt from "jsonwebtoken";
import { envConfig } from "../Config/envConfig.js";
import { User } from "../Model/user.model.js";


export const authenticateToken = async(req,res,next)=>{
    const token = req.cookies?.jwt;
    if(!token){
        return res.status(401).json({
            message:"Access Denied. No token provided"
        });
    }try {
        const decoded = jwt.verify(token,envConfig?.jwtSecretToken);
        const user = await User.findOne({_id:decoded?._id}).select("-password");
        if(!user){
            return res.status(401).json({message:"Invalid Token"});
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({
            message:"Invalid token"
        }); 
    }
}