import mongoose from "mongoose";

const chatSchema =new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    sender:{
        type:String,
        enum: ['user','ai-bot']
    },
    text:{
        type:String
    }
},{
    timestamps:true
});

const ChatBot = mongoose.model("chat-bot",chatSchema);
export {ChatBot};