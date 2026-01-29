import mongoose, { Schema } from "mongoose";

const jobSchema = new mongoose.Schema({
    jobTitle:{
        type: String
    },
    description: String,
    requireSkils: [String],
    experience: String,
    location: String,
    createdAt : {
        type : Date,
        default : Date.now
    },
    endAt : {
        type : Date,
    },
    workType : {
        type : String,
        enum : ["onsite","remote","hybrid"]
    },
    workCategory : {
        type : String,
        enum : ["part-time","full-time","trainee","internship"]
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
})

const Job = mongoose.model("Job",jobSchema);
export {Job};