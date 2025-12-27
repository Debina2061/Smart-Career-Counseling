import {v2 as cloudinary} from "cloudinary";
import { envConfig } from "../Config/envConfig.js";

cloudinary.config({
    cloud_name:envConfig?.cloudName,
    api_key:envConfig?.cloudKey,
    api_secret:envConfig?.cloudSecret
});


export const uploadPdf =  (buffer)=>{
    return  new Promise((resolve,reject)=>{
        const uploadCloudinary = cloudinary.uploader.upload_stream({
            resource_type : "raw",
            format : "pdf",
            folder : "resume",
            access_mode: "public"
        },(err,result)=>{
            if(err) reject(`Error on uploading resume: ${err.message}`);
            else{
                console.log("Resume upload sucess");
                return resolve(result)
            }
        }).end(buffer);
    })
}

export {cloudinary}