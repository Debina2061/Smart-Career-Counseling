import { User } from "../Model/user.model.js";
import bcrypt from "bcrypt";
import {generateToken} from "../utils/generateToken.js";
import { Decryption, Encryption } from "../utils/encrypt.js";
import crypto from "crypto"
import { envConfig } from "../Config/envConfig.js";
import { LoginVerify } from "../Model/loginVerify.model.js";
import { SendMail } from "../utils/nodemailer.js";
import { verifyEmail } from "../utils/templates/loginVerifyMail.js";
export const SignUp = async (req,res)=>{
    const { name,email,password } = req.body;
    if(!name || !email || !password){
        return res.status(400).json({
            message:"User must be provided all fields for sign up"
        });
    }
    const regExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!regExp.test(email)){
        return res.status(400).json({
            message:"Please provide a valid email address"
        });
    };
    const existingUser = await User.findOne({email:email}).select("-password");
    if(existingUser){
        return res.status(401).json({
            message:"User with this email already exists"
        });
    };

    const hashedPassword = bcrypt.hashSync(password,10)
    const newUser = await User.create({
        email:email
        ,name:name
        ,password:hashedPassword
        ,authProvider:"local"
    });
    return res.status(201).json({
        message:"User created successfully"
    });
}

export const LoginRequest = async (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            message:"User must provide all fields for sign in"
        });
    }
    const existingUser = await User.findOne({email:email});
    if(!existingUser){
        return res.status(404).json({
            message:"User with this email does not exist"
        });
    }
    const isPasswordValid = bcrypt.compareSync(password,existingUser.password);
    if(!isPasswordValid){
        return res.status(401).json({
            message:"Invalid password"
        });
    }

    let token = crypto.randomBytes(64).toString("hex");
    await LoginVerify.create({
        email,token
    });
    let verifyLink = `${envConfig.backendUrl}/auth/verify-token?email=${email}&token=${token}`;
    const htmlContent = verifyEmail(email,verifyLink);
    SendMail({email:email,subject:"Verify Login User",html:htmlContent});
    // res.redirect(verifyLink);
    return res.status(200).json({
        messsage : "Please check your email to verify you login",
        token : token
    });
};

export const loginVerify = async (req,res)=>{
    const {token,email} = req.query;
    const tokenResponse = await LoginVerify.findOne({email:email,token:token});
    if(!tokenResponse){
        return res.status(401).json({message:"verification failed"});
    }
    
    const userInfo = await User.findOne({email:tokenResponse?.email}).select("-password");
    console.log(userInfo)
    generateToken(userInfo,res);
    return res.status(200).json({
        message:"User signed in successfully",
        user:userInfo?.user
        });
}

export const SignOut = async (req,res)=>{
    res.clearCookie("jwt");
    return res.status(200).json({
        message:"User signed out successfully"
    });
};

export const Profile = async (req,res)=>{
    const user = req.user;
    return res.status(200).json({
        message:"User profile fetched successfully",
        user
    });
}

export const ChangePassword = async (req,res)=>{
    const {_id : userId} = req.user;
    const {oldPassword,newPassword} = req.body;
    if(!oldPassword || !newPassword){
        return res.status(400).json({
            message:"Old password and new password must be provided"
        });
    }
    const user = await User.findById(userId);
    if(!user){
        return res.status(404).json({
            message:"User not found"
        });
    }
    const isOldPasswordValid = Decryption(oldPassword,user.password);
    if(!isOldPasswordValid){
        return res.status(401).json({
            message: "Old passsword is incorrect"
        });
    } 
    const hashNewPassowrd = Encryption(newPassword);
    user.password = hashNewPassowrd;
    new user.save();
    return res.status(200).json({
        message : "Password changes successfully"
    });
}

export const ForgetPassword = (req,res)=>{
    const {email} = req.body;
}