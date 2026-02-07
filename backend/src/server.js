import express from "express";
import cors from "cors";
import { envConfig } from "./Config/envConfig.js";
import { connectDb } from "./Config/dbConnect.js";
import "./utils/passport.js";
import cookieParser from "cookie-parser";
import { authRouter } from "./Routes/auth.route.js";
import { userRouter } from "./Routes/user.route.js";
import { jobRoute } from "./Routes/job.route.js";
import { recommendationRouter } from "./Routes/recommendation.route.js";
import { chatRouter } from "./Routes/chatbot.route.js";
import { adminRouter } from "./Routes/admin.route.js";
import { inngestHandler } from "./Routes/inngest.route.js";
import { requestLogger, errorLogger } from "./middleware/logger.middleware.js";

const app = express();

// Connect Database
connectDb();

// Middleware for CORS
app.use(cors({
    origin: function(origin, callback) {
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:3000',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:3000',
            envConfig.frontendUrl
        ].filter(Boolean);
        
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200,
    exposedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware for cookie-parser
app.use(cookieParser());

// Middleware for JSON
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Inngest handler (requires JSON middleware)
app.use("/api/inngest", inngestHandler);

// Request logging middleware
app.use(requestLogger);

// Routes
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/job", jobRoute);
app.use("/recommendation", recommendationRouter);
app.use("/chat", chatRouter);
app.use("/admin", adminRouter);

// Health check endpoint
app.get("/health", (req, res) => {
    return res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Root endpoint
app.get("/", (req, res) => {
    return res.json({ 
        message: "Smart Career Counselling API",
        version: "1.0.0",
        endpoints: {
            auth: "/auth",
            user: "/user",
            jobs: "/job",
            recommendations: "/recommendation",
            chat: "/chat",
            admin: "/admin"
        }
    });
});

// Error logging middleware
app.use(errorLogger);

// Global error handler
app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal server error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
});

// 404 handler
app.use((req, res) => {
    return res.status(404).json({
        message: `${req.method} ${req.url} is not found`
    });
});

// Start server
app.listen(envConfig.portNumber, () => {
    console.log(`Server running at http://localhost:${envConfig.portNumber}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
