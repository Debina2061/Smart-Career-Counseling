import { User } from "../Model/user.model";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import { Decryption, Encryption } from "../utils/encrypt.js";


export const SignUp = async (req,res)=>{
    const {name,email,password} = req.body;
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
    const existingUser = await User.findOne({email:email});
    if(existingUser){
        res.status(409).json({
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
        message:"User created successfully",
        user:newUser.populate("-password")
    });
}

export const Login = async (req,res)=>{
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
    const token = generateToken(existingUser);

    return res.status(200).json({
        message:"User signed in successfully",
        user:existingUser.populate("-password"),
        token
    });
};

export const SignOut = async (req,res)=>{
    res.clearCookie("jwt");
    return res.status(200).json({
        message:"User signed out successfully"
    });
};

export const Profile = async (req,res)=>{
    const {_id : userId} = req.user;
    const user = await User.findById(userId).populate("-password");
    if(!user){
        return res.status(404).json({
            message:"User not found"
        });
    }
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