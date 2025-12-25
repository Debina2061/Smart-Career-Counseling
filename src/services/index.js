import { serve } from "inngest/express";
import { app } from "../main.js";
import { inngest } from "./inngest/client.js";
import {AiResponse} from "./inngest/functions/function.js"

app.use("/api/inngest",serve({
    client: inngest,
    functions: [AiResponse]
}));


// app.get("/api/hello",async(req,res)=>{
//     const {ids} = await inngest.send({
//         name:"test/resume.ranking"
//     });
//     return res.json({message:"hello-world",event:ids})
// })