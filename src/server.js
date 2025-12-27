import { envConfig } from "./Config/envConfig.js"
import { app } from "./main.js"

app.use("/",(req,res)=>{
    console.log(`${req.method} ${req.url} ${req.ip}`);
    return res.json("")
})

app.listen(envConfig.portNumber,()=>{
    console.log(`Server run at ${envConfig.portNumber}`)
})



import "./services/index.js"   // It connect with inngest server