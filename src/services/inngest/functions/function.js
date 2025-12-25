import { inngest } from "../client.js";
import { ExtractText } from "../../../utils/pdf-parse.js";
import { getGroqChatCompletion } from "../../../utils/groq.setup.js"; 

export const AiResponse = inngest.createFunction(
  { id: "resume-ranking" },
  { event: "test/resume.ranking" },
  async ({ event, step }) => {
    const textExtractFromPdf = await step.run("extract-pdf-text", async () => {
      try {
        const text = await ExtractText(
          event.data?.pdfUrl || "https://www.debinabaraili.com.np/debinaBaraili.pdf"
        );
        return text;
      } catch (error) {
        throw new Error(`PDF extraction failed: ${error.message}`);
      }
    });
    console.log("=".repeat(50))
    console.log(textExtractFromPdf)
    const responseAi = await step.run("analysis-resume",async()=>{
      const jsonText = await getGroqChatCompletion(textExtractFromPdf).catch((err)=>{
        throw new Error(`Error at Groq Response:${err.message}`)
      });
      return jsonText.choices[0].message.content;
    })
    console.log("=".repeat(50));
    console.log(responseAi)
    await step.run("log-completion", async () => {
      console.log("Resume analysis completed successfully");
      console.log("=".repeat(60));
      return { status: "completed" };
    });

    return {
      message: "Resume analysis completed successfully",
      eventId: event.id,
      extractedText: textExtractFromPdf,
      jsonText:responseAi,
      parsedResume: responseAi,
      timestamp: new Date().toISOString(),
    };
  }
);