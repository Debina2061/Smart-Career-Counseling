import { inngest } from "../client.js";
import { ExtractText } from "../../../utils/pdf-parse.js";
import { getGroqChatCompletion } from "../../../utils/groq.setup.js";
import { Resume } from "../../../Model/resume.model.js";
import { err } from "inngest/types";

export const AiResponse = inngest.createFunction(
  { id: "resume-ranking" },
  { event: "test/resume.ranking" },
  async ({ event, step }) => {
    const textExtractFromPdf = await step.run("extract-pdf-text", async () => {
      try {
        console.log(event.data?.resumeUrl)
        const text = await ExtractText(
          event.data?.resumeUrl 
        );
        return text;
      } catch (error) {
        throw new Error(`PDF extraction failed: ${error.message}`);
      }
    });
    // console.log("=".repeat(50))
    // console.log(textExtractFromPdf)
    const responseAi = await step.run("analysis-resume",async()=>{
      const jsonText = await getGroqChatCompletion(textExtractFromPdf).catch((err)=>{
        throw new Error(`Error at Groq Response:${err.message}`)
      });
      return jsonText.choices[0].message.content;
    })
    // console.log("=".repeat(50));
    // console.log(responseAi)
    await step.run("log-completion", async () => {
      console.log("Resume analysis completed successfully");
      console.log("=".repeat(60));
      return { status: "completed" };
    });

    await step.run("Save-in-database",async()=>{
      try {
        const applicant = await Resume.findOne({_id:id});
      if(!applicant){
        await Resume.create({
          userId : event.data?.userId,
          resumeUrl : event.data?.resumeUrl,
          resumeContent : responseAi,
          atsScore : 0
        });
      }
      applicant.resumeUrl = event.data?.resumeUrl;
      applicant.resumeContent = responseAi;
      await applicant.save()
      } catch (error) {
        console.log(`Error at save-in-database event:${err.message}`);
      }
    });
    return {
      message: "Resume analysis completed successfully",
      eventId: event.id,
      extractedText: textExtractFromPdf,
      jsonText:responseAi,
      timestamp: new Date().toISOString(),
    };
  }
);