import mongoose from "mongoose";

export const resumeSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
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