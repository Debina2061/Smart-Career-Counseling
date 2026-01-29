import { Job } from "../Model/job.model.js";
export const createJob = async (req, res) => {
  const { jobTitle, description, requireSkils, experience, endDay, workType,workCategory} = req.body;
  if (!jobTitle || !requireSkils || !experience || !endDay || !workType || !workCategory)
    return res.status(400).json({ message: "Attributes must be provided" });
  const job = await Job.create({
    jobTitle: jobTitle,
    description: description,
    requireSkils: requireSkils,
    experience: `${experience} year`,
    endAt: Date.now() + endDay * 24 * 60 * 1000,
    workType: workType,
    workCategory : workCategory,
    createdBy : req.user._id
  });
  if(!job){
    return res.status(403).json({
        message:"Something Wrong at Creating Job model"
    });
  }
  return res.status(200).json({
    message:"Job created Successfully",
    data : job
  })
};