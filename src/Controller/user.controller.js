import { Resume } from "../Model/resume.model.js";
import { inngest } from "../services/inngest/client.js";
import { uploadPdf } from "../utils/cloudinary.js";
import { cloudinary } from "../utils/cloudinary.js";

export const uploadResume = async (req, res) => {
  if (!req.file)
    return res.status(403).json({ message: "Resume must be upload" });
  // console.log(req.file)
  if (req.file.mimetype !== "application/pdf")
    return res.status(400).json({ message: "only pdf allowed" });

  //TODO: I have to fix not found error on cloudinary
  const {secure_url,public_id} = await uploadPdf(req.file.buffer)
  const signedPdfUrl = cloudinary.utils.private_download_url(
    public_id,
    "pdf",
    {
      resource_type: "raw",
      expires_at: Math.floor(Date.now() / 1000) + 300, // 5 minutes
    }
  );
//   const { secure_url } = await uploadPdf(signedPdfUrl);
  const { ids } = await inngest.send({
    name: "test/resume.ranking",
    data: {
      resumeUrl: signedPdfUrl,
      userId: req.user._id,
    },
  });
  return res.status(200).json({
    message: "Resume upload successfully",
    eventId: ids,
  });
};