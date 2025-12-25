import {v2 as cloudinary} from "cloudinary";
import { envConfig } from "../Config/envConfig.js";

cloudinary.config({
    cloud_name:envConfig?.cloudName,
    api_key:envConfig?.cloudKey,
    api_secret:envConfig?.cloudSecret
});

export {cloudinary}