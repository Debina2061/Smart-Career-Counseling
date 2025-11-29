import mongoose from "mongoose";

const carrerSchema = new mongoose.Schema({
    careerName:{
        type: String
    },
    description: String,
    requireSkils: [String],
    marketDemands: [String]
})

const Career = mongoose.model("Career",carrerSchema);
export {Career};