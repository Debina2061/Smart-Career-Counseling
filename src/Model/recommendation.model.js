import mongoose from "mongoose";

const recommendatioinSchema = new mongoose.Schema({
    userId: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User",
       required: true
    },
    careerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Career"
    },
    recommendationDate:{
        type:Date
    }
});

const Recommand = mongoose.Schema("Recommand",recommendatioinSchema);
export {Recommand};