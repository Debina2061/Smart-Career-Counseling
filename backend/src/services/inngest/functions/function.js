import { inngest } from "../client.js";
import { ExtractText } from "../../../utils/pdf-parse.js";
import { Resume } from "../../../Model/resume.model.js";
import { analyzeResumeContent } from "../../../utils/resumeAnalysis.js";
import { cloudinary } from "../../../utils/cloudinary.js";

export const AiResponse = inngest.createFunction(
  { id: "resume-analysis" },
  { event: "resume/analyze" },
  async ({ event, step }) => {
    const { resumeId, userId, resumePublicId, resumeUrl } = event.data || {};

    try {
      const signedUrl = resumePublicId
        ? cloudinary.url(resumePublicId, {
            resource_type: "raw",
            type: "upload",
            sign_url: true,
            secure: true,
          })
        : resumeUrl;

      if (!signedUrl) {
        throw new Error("Missing resume URL or public id");
      }

      const textExtractFromPdf = await step.run("extract-pdf-text", async () => {
        const text = await ExtractText(signedUrl);
        return text;
      });

      const analysis = await step.run("analysis-resume", async () => {
        return analyzeResumeContent(textExtractFromPdf);
      });

      await step.run("save-in-database", async () => {
        let resume = null;
        if (resumeId) resume = await Resume.findById(resumeId);
        if (!resume && userId) resume = await Resume.findOne({ userId });

        if (!resume) {
          await Resume.create({
            userId,
            resumeUrl: resumeUrl || "",
            resumePublicId: resumePublicId || "",
            resumeContent: analysis.parsedResume || analysis.parsedContent,
            atsScore: analysis.atsScore,
            suggestions: analysis.suggestions,
            analysisStatus: "completed",
            analysisError: "",
          });
          return;
        }

        resume.resumeUrl = resumeUrl || resume.resumeUrl;
        resume.resumePublicId = resumePublicId || resume.resumePublicId;
        resume.resumeContent = analysis.parsedResume || analysis.parsedContent;
        resume.atsScore = analysis.atsScore;
        resume.suggestions = analysis.suggestions;
        resume.analysisStatus = "completed";
        resume.analysisError = "";
        await resume.save();
      });

      await step.run("log-completion", async () => {
        console.log("Resume analysis completed successfully");
        return { status: "completed" };
      });

      return {
        message: "Resume analysis completed successfully",
        eventId: event.id,
        resumeId,
        userId,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      await step.run("mark-failed", async () => {
        let resume = null;
        if (resumeId) resume = await Resume.findById(resumeId);
        if (!resume && userId) resume = await Resume.findOne({ userId });
        if (resume) {
          resume.analysisStatus = "failed";
          resume.analysisError = error?.message || "Resume analysis failed";
          await resume.save();
        }
      });

      throw error;
    }
  }
);
