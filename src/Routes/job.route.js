import { Router } from "express";
import { createJob } from "../Controller/job.controller.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
const jobRoute = Router();



jobRoute.route("/create").post(authenticateToken,ErrorHandler(createJob));


export {jobRoute};