import { serve } from "inngest/express";
import { app } from "../main.js";
import { inngest } from "./inngest/client.js";
import {singleStage} from "./inngest/functions/function.js"

app.use("/api/inngest",serve({
    client: inngest,
    functions: [singleStage]
}));


app.get("/api/hello",async(req,res)=>{
    await inngest.send({
        name:"test/event.first"
    });
    return res.json({message:"hello-world"})
})