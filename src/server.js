import { envConfig } from "./Config/envConfig.js"
import { app } from "./main.js"

app.listen(envConfig.portNumber,()=>{
    console.log(`Server run at ${envConfig.portNumber}`)
})