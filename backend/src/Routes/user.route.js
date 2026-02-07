import express from "express";
import {
  uploadResume,
  getProfile,
  getResume,
  getDashboard,
} from "../Controller/user.controller.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import {uploadCv} from "../middleware/multer.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

export const userRouter = express.Router();


userRouter
  .route("/upload_resume")
  .post(authenticateToken, uploadCv.single("resume"), ErrorHandler(uploadResume));

userRouter.route("/profile").get(authenticateToken, ErrorHandler(getProfile));
userRouter.route("/resume").get(authenticateToken, ErrorHandler(getResume));
userRouter.route("/dashboard").get(authenticateToken, ErrorHandler(getDashboard));
