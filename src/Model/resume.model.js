import mongoose from "mongoose";

export const resumeSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    resumeUrl : {
        type : String
    },
    resumeContent : {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    atsScore:{
        type:Number,
        min: 0,
        max: 100,
        default:0
    }
});

const Resume = mongoose.model("Resume",resumeSchema);
export {Resume};