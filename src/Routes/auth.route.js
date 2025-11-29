import { Router } from "express";
const authRouter = Router();
import passport from "passport";
import { generateToken } from "../utils/generateToken.js";

authRouter.get("/github",passport.authenticate("github",{session:false}))
authRouter.get("/github/callback",passport.authenticate("github",{failureRedirect:"/login",session:false}),(req,res)=>{
    const token = generateToken(req?.user,res);
    // return res.cookie()
    return res.json({message:"Login Successfully"});
});

authRouter.get("/google",passport.authenticate("google",{session:false}))
authRouter.get("/google/callback",passport.authenticate("google",{failureRedirect:"/login",session:false}),(req,res)=>{
    return res.redirect("/");
});

export {authRouter};