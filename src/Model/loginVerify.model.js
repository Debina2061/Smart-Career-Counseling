import mongoose from "mongoose";

const loginVerifySchema = new mongoose.Schema({
    email : String,
    token : String,
    expiredAt: {
        type: Date,
        default: Date.now()+ 5*60*1000 //5min
    }
});

const LoginVerify = mongoose.model("LoginVerify",loginVerifySchema);
export {LoginVerify};