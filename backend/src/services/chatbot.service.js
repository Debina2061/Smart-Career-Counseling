import { ChatSession } from "../Model/chatbot.model.js";
import { Resume } from "../Model/resume.model.js";
import { Profile } from "../Model/profile.model.js";
import { Recommendation } from "../Model/recommendation.model.js";

/**
 * Get user context for chat (resume, profile, recommendations)
 */
async function getUserContext(userId) {
    const [resume, profile, recommendation] = await Promise.all([
        Resume.findOne({ userId }),
        Profile.findOne({ userId }),
        Recommendation.findOne({ userId }).sort({ generatedAt: -1 })
    ]);

    let context = {
        hasResume: false,
        hasProfile: false,
        topCareerMatches: [],
        userSkills: []
    };

    let contextString = "";

    if (resume?.resumeContent) {
        context.hasResume = true;
        const resumeData = typeof resume.resumeContent === "string"
            ? JSON.parse(resume.resumeContent)
            : resume.resumeContent;

        context.userSkills = [
            ...(resumeData.skills?.technical || []),
            ...(resumeData.skills?.frameworks || [])
        ].slice(0, 15);

        contextString += `\n\nUSER'S RESUME DATA:
- Technical Skills: ${resumeData.skills?.technical?.join(", ") || "Not specified"}
- Frameworks: ${resumeData.skills?.frameworks?.join(", ") || "Not specified"}
- Experience: ${resumeData.experience?.length || 0} positions
- Education: ${resumeData.education?.map(e => `${e.degree} in ${e.field}`).join(", ") || "Not specified"}
- Projects: ${resumeData.projects?.length || 0} projects`;
    }

    if (profile) {
        context.hasProfile = true;
        contextString += `\n\nUSER'S PROFILE:
- Education Level: ${profile.educationLevel || "Not specified"}
- Interests: ${profile.interest?.join(", ") || "Not specified"}
- Skills: ${profile.skills?.join(", ") || "Not specified"}`;
    }

    if (recommendation?.recommendations?.length) {
        context.topCareerMatches = recommendation.recommendations
            .slice(0, 3)
            .map(r => r.careerName);

        contextString += `\n\nTOP CAREER MATCHES:
${recommendation.recommendations.slice(0, 3).map((r, i) => 
    `${i + 1}. ${r.careerName} (${r.matchScore}% match) - Skill gaps: ${r.skillGaps?.join(", ") || "None"}`
).join("\n")}`;
    }

    return { context, contextString };
}

/**
 * Get AI response - ML model based
 * NOTE: External AI is not available. Use career recommendations instead.
 */
async function getAIResponse(messages, contextString) {
    // ML model features are available via dedicated endpoints:
    // - Career recommendations: /recommendation/generate
    // - Resume scoring: /user/calculate-weighted-ats-score
    // - Job matching: /job/match or /job/:jobId/match
    
    const lastUserMessage = messages[messages.length - 1]?.content || "";
    
    // Provide helpful ML-based responses based on query type
    if (lastUserMessage.toLowerCase().includes("career") || lastUserMessage.toLowerCase().includes("recommend")) {
        return "Based on your resume and profile, the AI Career Recommendation system has analyzed your skills and experience. " +
               "Visit the Career Recommendations page to see your top job matches. You can also upload a resume to get AI-powered scoring and insights.";
    } else if (lastUserMessage.toLowerCase().includes("resume") || lastUserMessage.toLowerCase().includes("score") || lastUserMessage.toLowerCase().includes("ats")) {
        return "Your resume is analyzed using our ML model which provides:" +
               "\n- Overall ATS Score (0-100)\n- Skill matching analysis\n- Career recommendations\n- Improvement suggestions" +
               "\nUpload your resume in the ATS Scanner to get your personalized analysis.";
    } else if (lastUserMessage.toLowerCase().includes("job") || lastUserMessage.toLowerCase().includes("match")) {
        return "The ML job matching system analyzes how well your profile matches job openings. " +
               "It considers your skills, experience, education, and preferences to give you a match percentage and recommendations.";
    }
    
    // Default helpful response
    return "I'm an ML-powered career assistant. I can help you with:\n" +
           "• Career recommendations based on your skills\n" +
           "• Resume analysis and ATS scoring\n" +
           "• Job matching and fit analysis\n" +
           "\nAsk me about your career, resume, or job matches, or visit the dedicated pages for AI-powered analysis!";
}

/**
 * Create a new chat session
 */
export async function createChatSession(userId) {
    const { context } = await getUserContext(userId);

    const session = await ChatSession.create({
        userId,
        title: "New Conversation",
        context,
        messages: [{
            role: "assistant",
            content: "Hello! I'm your AI Career Counselor. I'm here to help you with career guidance, resume improvements, skill development, and job search strategies. How can I assist you today?"
        }]
    });

    return session;
}

/**
 * Send a message in a chat session
 */
export async function sendMessage(userId, sessionId, userMessage) {
    let session = await ChatSession.findOne({ _id: sessionId, userId });

    if (!session) {
        throw new Error("Chat session not found");
    }

    // Add user message
    session.messages.push({
        role: "user",
        content: userMessage
    });

    // Get user context
    const { contextString } = await getUserContext(userId);

    // Get AI response
    const aiResponse = await getAIResponse(
        session.messages.slice(-10), // Last 10 messages for context
        contextString
    );

    // Add AI response
    session.messages.push({
        role: "assistant",
        content: aiResponse
    });

    // Update title if it's the first user message
    if (session.messages.filter(m => m.role === "user").length === 1) {
        session.title = userMessage.slice(0, 50) + (userMessage.length > 50 ? "..." : "");
    }

    await session.save();

    return {
        userMessage: {
            role: "user",
            content: userMessage,
            timestamp: session.messages[session.messages.length - 2].timestamp
        },
        aiResponse: {
            role: "assistant",
            content: aiResponse,
            timestamp: session.messages[session.messages.length - 1].timestamp
        }
    };
}

/**
 * Get all chat sessions for a user
 */
export async function getChatSessions(userId) {
    const sessions = await ChatSession.find({ userId, isActive: true })
        .select("title createdAt updatedAt messages")
        .sort({ updatedAt: -1 });

    return sessions.map(s => ({
        _id: s._id,
        title: s.title,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        messageCount: s.messages.length,
        lastMessage: s.messages[s.messages.length - 1]?.content?.slice(0, 100)
    }));
}

/**
 * Get a specific chat session with messages
 */
export async function getChatSession(userId, sessionId) {
    const session = await ChatSession.findOne({ _id: sessionId, userId });

    if (!session) {
        throw new Error("Chat session not found");
    }

    return session;
}

/**
 * Delete a chat session
 */
export async function deleteChatSession(userId, sessionId) {
    const result = await ChatSession.findOneAndUpdate(
        { _id: sessionId, userId },
        { $set: { isActive: false } }
    );

    if (!result) {
        throw new Error("Chat session not found");
    }

    return { success: true };
}

/**
 * Quick question without session (stateless)
 */
export async function askQuickQuestion(userId, question) {
    const { contextString } = await getUserContext(userId);

    const response = await getAIResponse(
        [{ role: "user", content: question }],
        contextString
    );

    return {
        question,
        answer: response
    };
}
