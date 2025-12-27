import express from "express";
import { uploadResume } from "../Controller/user.controller.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import {uploadCv} from "../middleware/multer.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

export const userRouter = express.Router();


userRouter.route("/upload_resume").get(authenticateToken,uploadCv.single("resume"),uploadResume)