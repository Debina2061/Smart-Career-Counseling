import { LoginVerify } from "../Model/loginVerify.model.js";
import { Resume } from "../Model/resume.model.js";
import { User } from "../Model/user.model.js";
import { inngest } from "../services/inngest/client.js";
import { uploadPdf } from "../utils/cloudinary.js";
import { cloudinary } from "../utils/cloudinary.js";
import { SendMail } from "../utils/nodemailer.js";
import { verifyEmail } from "../utils/templates/loginVerifyMail.js";

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

export const sendVerificationUser = async (req,res)=>{
  const user = await User.findById(req.user?._id);
  if(!user) return res.status(403).json({message:"User is not found"});
  let token = crypto.randomBytes(8).toString("hex");
  await LoginVerify.create({
    email : user.email,token:token
  });
  setTimeout(async ()=>{
    await LoginVerify.findOneAndDelete({email:email,token:token});
  })
  let verifyLink = `${envConfig.backendUrl}/auth/verify-token?email=${user.email}&token=${token}`;
  const htmlContent = verifyEmail(email, verifyLink);
  SendMail({ email: email, subject: "Verify User", html: htmlContent });
  return res.status.json({message:"Verification email send successfully"});
}

export const verifyUser = async (req,res)=>{
  const {email,token} = req.query;
  if(!email || !token) return res.json({message:"email and token must be provided in query"});
  const verifyUser = await LoginVerify.findOne({
    email:email,token:token
  })
  if(!verifyUser){
    return res.status(404).json({message:"Email and token is not matched"});
  };
  await User.find(email,{
    $set : {
      isVerified : true
    }
  });
  return res.status(200).json({message:"User verified succesfully"});
}