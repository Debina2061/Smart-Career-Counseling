import jwt from "jsonwebtoken";
import { envConfig } from "../Config/envConfig.js";


export const authenticateToken = (req,res,next)=>{
    const token = req.cookies?.jwt;
    if(!token){
        return res.status(401).json({
            message:"Access Denied. No token provided"
        });
    }try {
        const decoded = jwt.verify(token,envConfig?.jwtSecretToken);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            message:"Invalid token"
        }); 
    }
}
