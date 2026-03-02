import crypto from "crypto";
import axios from "axios";
import { envConfig } from "../Config/envConfig.js";
import { LoginVerify } from "../Model/loginVerify.model.js";
import { Resume } from "../Model/resume.model.js";
import { Profile } from "../Model/profile.model.js";
import { User } from "../Model/user.model.js";
import { Recommendation } from "../Model/recommendation.model.js";
import { ChatSession } from "../Model/chatbot.model.js";
import { ATSScanHistory } from "../Model/atsScanHistory.model.js";
import { uploadPdf, cloudinary } from "../utils/cloudinary.js";
import { SendMail } from "../utils/nodemailer.js";
import { verifyEmail } from "../utils/templates/loginVerifyMail.js";
import { ExtractText } from "../utils/pdf-parse.js";
import { analyzeResumeContent } from "../utils/resumeAnalysis.js";
import { calculateATSScore, extractSkillsFromJobDescription, detectResumeType } from "../utils/atsScoring.js";
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
    
    // Detect resume type
    const resumeTypeResult = detectResumeType(extractedText);
    resumeDoc.resume_type = resumeTypeResult.type;
    resumeDoc.resume_type_confidence = resumeTypeResult.confidence;
    resumeDoc.resume_type_indicators = resumeTypeResult.indicators;
    
    await resumeDoc.save();

    return res.status(200).json({
      message: "Resume uploaded and analyzed successfully",
      resumeUrl: secure_url,
      analysis: analysis.parsedResume || analysis.parsedContent,
      atsScore: analysis.atsScore,
      suggestions: analysis.suggestions,
      analysisStatus: resumeDoc.analysisStatus,
      resume_type: resumeTypeResult.type,
      resume_type_confidence: resumeTypeResult.confidence,
      resume_type_indicators: resumeTypeResult.indicators,
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

export const getResumePdf = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user._id });
    if (!resume || !resume.resumeUrl) {
      return res.status(404).json({ message: "Resume PDF not found" });
    }

    console.log("[getResumePdf] Fetching PDF for user:", req.user._id);
    console.log("[getResumePdf] Resume URL:", resume.resumeUrl);

    // Approach 1: Proxy the PDF from Cloudinary
    try {
      const response = await axios.get(resume.resumeUrl, {
        responseType: "arraybuffer",
        timeout: 15000,
        maxRedirects: 5,
      });
      console.log("[getResumePdf] Fetched", response.data.byteLength, "bytes");
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline; filename=resume.pdf");
      res.setHeader("Cache-Control", "private, max-age=300");
      return res.send(Buffer.from(response.data));
    } catch (proxyErr) {
      console.error("[getResumePdf] Proxy fetch failed:", proxyErr.message);
    }

    // Approach 2: Generate a signed Cloudinary URL and redirect
    if (resume.resumePublicId) {
      try {
        const signedUrl = cloudinary.url(resume.resumePublicId, {
          resource_type: "raw",
          sign_url: true,
          secure: true,
          type: "upload",
        });
        console.log("[getResumePdf] Redirecting to signed URL:", signedUrl);
        return res.redirect(signedUrl);
      } catch (signErr) {
        console.error("[getResumePdf] Signed URL failed:", signErr.message);
      }
    }

    // Approach 3: Redirect to the original Cloudinary URL as last resort
    console.log("[getResumePdf] Redirecting to original URL");
    return res.redirect(resume.resumeUrl);
  } catch (err) {
    console.error("[getResumePdf] Fatal error:", err.message, err.stack);
    return res.status(500).json({ message: "Failed to fetch resume PDF" });
  }
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

/**
 * ============================================
 * WEIGHTED ATS SCORING ENDPOINT
 * ============================================
 * Calculates comprehensive ATS score based on:
 * - Keyword Matching (50%)
 * - Section Completeness (20%)
 * - Experience & Projects (20%)
 * - Formatting & Quality (10%)
 * 
 * Can be used with or without job description
 */
export const calculateWeightedATSScore = async (req, res) => {
  try {
    const userId = req.user._id;
    const { jobDescription, requiredSkills } = req.body;

    // Get user's resume
    const resume = await Resume.findOne({ userId });
    
    if (!resume || !resume.resumeUrl) {
      return res.status(404).json({
        message: "No resume found. Please upload your resume first.",
        success: false
      });
    }

    // Extract resume text
    let resumeText = "";
    
    // Try to get text from stored parsed content first
    if (resume.resumeContent) {
      try {
        const content = typeof resume.resumeContent === 'string' 
          ? JSON.parse(resume.resumeContent) 
          : resume.resumeContent;
        
        // Build full text from structured content
        const parts = [];
        
        if (content.personalInfo) {
          const pi = content.personalInfo;
          parts.push(
            pi.name || '',
            pi.email || '',
            pi.phone || '',
            pi.location || '',
            pi.linkedin || '',
            pi.portfolio || ''
          );
        }
        
        if (content.summary) parts.push(content.summary);
        
        if (Array.isArray(content.experience)) {
          content.experience.forEach(exp => {
            parts.push(
              exp.company || '',
              exp.position || '',
              exp.description || '',
              ...(exp.achievements || [])
            );
          });
        }
        
        if (Array.isArray(content.education)) {
          content.education.forEach(edu => {
            parts.push(
              edu.institution || '',
              edu.degree || '',
              edu.field || ''
            );
          });
        }
        
        if (content.skills) {
          parts.push(
            ...(content.skills.technical || []),
            ...(content.skills.frameworks || []),
            ...(content.skills.languages || []),
            ...(content.skills.soft || [])
          );
        }
        
        if (Array.isArray(content.projects)) {
          content.projects.forEach(proj => {
            parts.push(
              proj.name || '',
              proj.description || '',
              ...(proj.technologies || [])
            );
          });
        }
        
        if (Array.isArray(content.certifications)) {
          content.certifications.forEach(cert => {
            parts.push(cert.name || '', cert.issuer || '');
          });
        }
        
        resumeText = parts.filter(Boolean).join(' ');
      } catch (parseError) {
        console.error('Error parsing resume content:', parseError);
      }
    }
    
    // If no text extracted from structured content, try extracting from PDF
    if (!resumeText || resumeText.length < 100) {
      try {
        resumeText = await ExtractText(resume.resumeUrl);
      } catch (extractError) {
        console.error('Error extracting text from PDF:', extractError);
        return res.status(500).json({
          message: "Could not extract text from resume. Please try uploading again.",
          error: extractError.message,
          success: false
        });
      }
    }

    // Determine required skills
    let skillsList = [];
    
    if (Array.isArray(requiredSkills) && requiredSkills.length > 0) {
      // Use provided skills
      skillsList = requiredSkills.map(s => s.trim()).filter(Boolean);
    } else if (jobDescription && typeof jobDescription === 'string') {
      // Extract skills from job description
      skillsList = extractSkillsFromJobDescription(jobDescription);
    }

    // Calculate weighted ATS score
    const scoreResult = calculateATSScore(
      resumeText,
      skillsList,
      resume.resumeContent
    );

    // Save the new weighted score to database (optional - add new field if needed)
    resume.weightedAtsScore = scoreResult.final_score;
    resume.lastScoredAt = new Date();
    await resume.save();

    // Save to scan history
    await saveScanToHistory(userId, {
      resumeUrl: resume.resumeUrl,
      resumePublicId: resume.resumePublicId,
      resumeName: "Resume.pdf",
      scanType: "detailed",
      jobDescription: jobDescription || "",
      detailedResults: scoreResult,
      resumeSnapshot: resume.resumeContent
    });

    return res.status(200).json({
      message: "ATS score calculated successfully",
      success: true,
      data: scoreResult,
      metadata: {
        resumeId: resume._id,
        analyzedWith: jobDescription ? 'job description' : (skillsList.length > 0 ? 'required skills' : 'general assessment'),
        totalSkillsAnalyzed: skillsList.length,
        resumeLength: resumeText.length
      }
    });

  } catch (error) {
    console.error("Weighted ATS scoring error:", error);
    return res.status(500).json({
      message: "Error calculating ATS score",
      error: error.message,
      success: false
    });
  }
};

/**
 * Score resume against specific job posting
 * Simplified endpoint that requires job description
 */
export const scoreResumeForJob = async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length < 20) {
      return res.status(400).json({
        message: "Please provide a valid job description (minimum 20 characters)",
        success: false
      });
    }

    // Reuse the main scoring function
    return await calculateWeightedATSScore(req, res);

  } catch (error) {
    console.error("Job-specific scoring error:", error);
    return res.status(500).json({
      message: "Error scoring resume for job",
      error: error.message,
      success: false
    });
  }
};

/**
 * ============================================
 * ATS SCAN HISTORY MANAGEMENT
 * ============================================
 * Save, retrieve, and manage ATS scan history
 */

/**
 * Save ATS scan to history
 * Called internally after each scan
 */
export const saveScanToHistory = async (userId, scanData) => {
  try {
    const scanHistory = new ATSScanHistory({
      userId,
      resumeUrl: scanData.resumeUrl,
      resumePublicId: scanData.resumePublicId || "",
      resumeName: scanData.resumeName || "Resume.pdf",
      scanType: scanData.scanType || "quick",
      jobDescription: scanData.jobDescription || "",
      quickScanResults: scanData.quickScanResults || {},
      detailedResults: scanData.detailedResults || {},
      resumeSnapshot: scanData.resumeSnapshot || {},
      scannedAt: new Date()
    });

    await scanHistory.save();
    return scanHistory;
  } catch (error) {
    console.error("Error saving scan to history:", error);
    return null;
  }
};

/**
 * HTTP endpoint to save scan to history
 * POST /user/scan-history
 */
export const saveScanToHistoryHTTP = async (req, res) => {
  try {
    const userId = req.user._id;
    const scanData = req.body;

    const savedScan = await saveScanToHistory(userId, scanData);
    
    if (!savedScan) {
      return res.status(500).json({
        message: "Failed to save scan to history",
        success: false
      });
    }

    return res.status(201).json({
      message: "Scan saved to history successfully",
      success: true,
      data: { scanId: savedScan._id }
    });
  } catch (error) {
    console.error("Error saving scan via HTTP:", error);
    return res.status(500).json({
      message: error.message || "Failed to save scan",
      success: false
    });
  }
};

/**
 * Get all scan history for a user
 * Returns list of all scans, sorted by most recent
 */
export const getScanHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 50, page = 1 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [scans, totalCount] = await Promise.all([
      ATSScanHistory.find({ userId })
        .sort({ scannedAt: -1 })
        .limit(parseInt(limit))
        .skip(skip)
        .select('-resumeSnapshot -__v')
        .lean(),
      ATSScanHistory.countDocuments({ userId })
    ]);

    // Format scans for response - include full results for detail view
    const formattedScans = scans.map(scan => ({
      _id: scan._id,
      id: scan._id,
      resumeName: scan.resumeName,
      resumeUrl: scan.resumeUrl,
      scanType: scan.scanType,
      scannedAt: scan.scannedAt,
      jobDescription: scan.jobDescription || '',
      // Include full results for detail view
      quickScanResults: scan.quickScanResults || {},
      detailedResults: scan.detailedResults || {},
      // Summary fields for list view
      score: scan.scanType === 'detailed' 
        ? scan.detailedResults?.overallScore || scan.detailedResults?.final_score || 0
        : scan.quickScanResults?.compatibility || 0,
      strengthLevel: scan.detailedResults?.strength_level || 'N/A',
      hasJobDescription: !!scan.jobDescription,
      matchedSkillsCount: scan.scanType === 'detailed'
        ? scan.detailedResults?.matched_skills?.length || 0
        : scan.quickScanResults?.matchedCount || scan.quickScanResults?.matched?.length || 0
    }));

    return res.status(200).json({
      message: "Scan history retrieved successfully",
      success: true,
      data: {
        scans: formattedScans,
        pagination: {
          total: totalCount,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalCount / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error("Get scan history error:", error);
    return res.status(500).json({
      message: "Error retrieving scan history",
      error: error.message,
      success: false
    });
  }
};

/**
 * Get a specific scan by ID
 * Returns full scan details
 */
export const getScanById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { scanId } = req.params;

    const scan = await ATSScanHistory.findOne({
      _id: scanId,
      userId: userId
    }).lean();

    if (!scan) {
      return res.status(404).json({
        message: "Scan not found",
        success: false
      });
    }

    return res.status(200).json({
      message: "Scan retrieved successfully",
      success: true,
      data: scan
    });

  } catch (error) {
    console.error("Get scan by ID error:", error);
    return res.status(500).json({
      message: "Error retrieving scan",
      error: error.message,
      success: false
    });
  }
};

/**
 * Delete a scan from history
 */
export const deleteScan = async (req, res) => {
  try {
    const userId = req.user._id;
    const { scanId } = req.params;

    const result = await ATSScanHistory.findOneAndDelete({
      _id: scanId,
      userId: userId
    });

    if (!result) {
      return res.status(404).json({
        message: "Scan not found",
        success: false
      });
    }

    return res.status(200).json({
      message: "Scan deleted successfully",
      success: true
    });

  } catch (error) {
    console.error("Delete scan error:", error);
    return res.status(500).json({
      message: "Error deleting scan",
      error: error.message,
      success: false
    });
  }
};

/**
 * Delete all scan history for user
 */
export const clearScanHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await ATSScanHistory.deleteMany({ userId });

    return res.status(200).json({
      message: `Successfully deleted ${result.deletedCount} scan(s)`,
      success: true,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error("Clear scan history error:", error);
    return res.status(500).json({
      message: "Error clearing scan history",
      error: error.message,
      success: false
    });
  }
};


