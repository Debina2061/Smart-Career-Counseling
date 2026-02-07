import crypto from "crypto";
import { envConfig } from "../Config/envConfig.js";
import { LoginVerify } from "../Model/loginVerify.model.js";
import { Resume } from "../Model/resume.model.js";
import { Profile } from "../Model/profile.model.js";
import { User } from "../Model/user.model.js";
import { Recommendation } from "../Model/recommendation.model.js";
import { ChatSession } from "../Model/chatbot.model.js";
import { uploadPdf } from "../utils/cloudinary.js";
import { SendMail } from "../utils/nodemailer.js";
import { verifyEmail } from "../utils/templates/loginVerifyMail.js";
import { ExtractText } from "../utils/pdf-parse.js";
import { analyzeResumeContent } from "../utils/resumeAnalysis.js";
import { getUserApplications } from "../services/job.service.js";
import { inngest } from "../services/inngest/client.js";

export const uploadResume = async (req, res) => {
  if (!req.file)
    return res.status(403).json({ message: "Resume must be uploaded" });

  if (req.file.mimetype !== "application/pdf")
    return res.status(400).json({ message: "Only PDF files are allowed" });

  try {
    const { secure_url, public_id } = await uploadPdf(req.file.buffer);

    const pdfUrl = secure_url;
    const useInngest = Boolean(envConfig.inngestEventKey);

    let resumeDoc = await Resume.findOne({ userId: req.user._id });
    if (!resumeDoc) resumeDoc = new Resume({ userId: req.user._id });

    resumeDoc.resumeUrl = pdfUrl;
    resumeDoc.resumePublicId = public_id || resumeDoc.resumePublicId;
    resumeDoc.analysisError = "";
    if (useInngest) resumeDoc.analysisStatus = "processing";
    await resumeDoc.save();

    if (useInngest) {
      try {
        await inngest.send({
          name: "resume/analyze",
          data: {
            resumeId: resumeDoc._id.toString(),
            userId: req.user._id.toString(),
            resumePublicId: public_id,
            resumeUrl: pdfUrl,
          },
        });

        return res.status(202).json({
          message: "Resume uploaded successfully. Analysis is in progress.",
          status: "processing",
          analysisStatus: "processing",
          resumeId: resumeDoc._id,
        });
      } catch (sendError) {
        console.error("Inngest send failed, falling back to sync:", sendError.message);
      }
    }

    let extractedText;
    try {
      extractedText = await ExtractText(req.file.buffer);
    } catch (err) {
      extractedText = await ExtractText(pdfUrl);
    }

    const analysis = await analyzeResumeContent(extractedText);

    resumeDoc.resumeContent = analysis.parsedResume || analysis.parsedContent;
    resumeDoc.atsScore = analysis.atsScore;
    resumeDoc.suggestions = analysis.suggestions;
    resumeDoc.analysisStatus = "completed";
    resumeDoc.analysisError = "";
    await resumeDoc.save();

    return res.status(200).json({
      message: "Resume uploaded and analyzed successfully",
      resumeUrl: secure_url,
      analysis: analysis.parsedResume || analysis.parsedContent,
      atsScore: analysis.atsScore,
      suggestions: analysis.suggestions,
      analysisStatus: resumeDoc.analysisStatus,
    });
  } catch (error) {
    console.error("Resume upload error:", error);
    return res.status(500).json({
      message: "Error uploading resume",
      error: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  const profile = await Profile.findOne({ userId: req.user._id });
  return res.status(200).json({
    message: "Profile fetched successfully",
    data: profile,
  });
};

export const getResume = async (req, res) => {
  const resume = await Resume.findOne({ userId: req.user._id });
  if (!resume) {
    return res.status(404).json({ message: "Resume not found" });
  }
  return res.status(200).json({
    message: "Resume fetched successfully",
    data: resume,
  });
};

export const getDashboard = async (req, res) => {
  const userId = req.user._id;
  const [profile, resume, recommendation, applications, chatSessions] =
    await Promise.all([
      Profile.findOne({ userId }),
      Resume.findOne({ userId }),
      Recommendation.findOne({ userId }).sort({ generatedAt: -1 }),
      getUserApplications(userId),
      ChatSession.find({ userId, isActive: true })
        .sort({ updatedAt: -1 })
        .limit(3),
    ]);

  const completionFields = [
    profile?.age,
    profile?.gender,
    profile?.educationLevel,
    profile?.skills?.length ? true : null,
    profile?.interest?.length ? true : null,
    resume ? true : null,
  ];
  const completionScore = completionFields.filter(Boolean).length;
  const completionPercent = Math.round((completionScore / completionFields.length) * 100);

  const topCareers =
    recommendation?.recommendations?.slice(0, 3).map((r) => ({
      careerName: r.careerName,
      matchScore: r.matchScore,
      growthPotential: r.growthPotential,
    })) || [];

  const recentApplications = applications.slice(0, 3).map((app) => ({
    jobTitle: app.jobTitle,
    company: app.company,
    appliedAt: app.appliedAt,
    status: app.status,
    matchScore: app.matchScore,
  }));

  const recentChats = chatSessions.map((session) => ({
    id: session._id,
    title: session.title,
    updatedAt: session.updatedAt,
    messageCount: session.messages?.length || 0,
    lastMessage: session.messages?.[session.messages.length - 1]?.content?.slice(0, 120),
  }));

  const resumeStatus = resume?.analysisStatus || "completed";
  const resumeScore = resumeStatus === "completed" ? resume?.atsScore : null;

  return res.status(200).json({
    message: "Dashboard data fetched",
    data: {
      profile: {
        name: req.user.name,
        email: req.user.email,
        avatarUrl: req.user.avatarUrl,
        isVerified: req.user.isVerified,
        completionPercent,
      },
      resume: resume
        ? {
            atsScore: resumeScore,
            updatedAt: resume.updatedAt,
            hasResume: true,
            analysisStatus: resumeStatus,
          }
        : { atsScore: null, updatedAt: null, hasResume: false, analysisStatus: "missing" },
      recommendations: {
        count: recommendation?.recommendations?.length || 0,
        generatedAt: recommendation?.generatedAt || null,
        topCareers,
      },
      applications: {
        count: applications.length,
        recent: recentApplications,
      },
      chat: {
        sessions: recentChats,
      },
    },
  });
};

export const sendVerificationUser = async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) return res.status(403).json({ message: "User is not found" });
  let token = crypto.randomBytes(8).toString("hex");
  await LoginVerify.create({
    email: user.email,
    token: token,
  });
  setTimeout(
    async () => {
      await LoginVerify.findOneAndDelete({ email: user.email, token: token });
    },
    5 * 60 * 1000,
  ); // 5 minutes
  let verifyLink = `${envConfig.backendUrl}/auth/verify-token?email=${user.email}&token=${token}`;
  const htmlContent = verifyEmail(user.email, verifyLink);
  SendMail({ email: user.email, subject: "Verify User", html: htmlContent });
  return res
    .status(200)
    .json({ message: "Verification email sent successfully" });
};

export const verifyUser = async (req, res) => {
  const { email, token } = req.query;
  if (!email || !token)
    return res
      .status(400)
      .json({ message: "email and token must be provided in query" });
  const verifyUserToken = await LoginVerify.findOne({
    email: email,
    token: token,
  });
  if (!verifyUserToken) {
    return res.status(404).json({ message: "Email and token is not matched" });
  }
  await User.findOneAndUpdate({ email: email }, { $set: { isVerified: true } });
  await LoginVerify.findOneAndDelete({ email: email, token: token });
  return res.status(200).json({ message: "User verified successfully" });
};
