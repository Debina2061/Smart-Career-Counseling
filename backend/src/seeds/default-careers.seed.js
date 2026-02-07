import { Career } from "../Model/carrerpath.model.js";
import mongoose from "mongoose";
import { connectDb } from "../Config/dbConnect.js";

/**
 * Seed default careers if database is empty
 */
export async function seedDefaultCareers() {
    try {
        const careerCount = await Career.countDocuments();
        
        if (careerCount > 0) {
            console.log(`[SEED] Career database already has ${careerCount} careers. Skipping seed.`);
            return;
        }
        
        console.log("[SEED] Seeding default careers...");
        
        const defaultCareers = [
            {
                careerName: "Software Developer",
                description: "Develop and maintain software applications using various programming languages",
                category: "technology",
                requiredSkills: {
                    technical: ["JavaScript", "React", "Node.js", "Git", "REST API"],
                    soft: ["Problem Solving", "Communication", "Teamwork"]
                },
                preferredEducation: [
                    {
                        level: "bachelor",
                        fields: ["Computer Science", "Software Engineering"]
                    }
                ],
                experienceLevel: "mid",
                experienceYearsRange: { min: 2, max: 8 },
                salaryRange: { min: 60000, max: 120000, currency: "USD" },
                marketDemand: "very-high",
                growthOutlook: "rapid-growth",
                isActive: true
            },
            {
                careerName: "Data Analyst",
                description: "Analyze data to help organizations make informed business decisions",
                category: "finance",
                requiredSkills: {
                    technical: ["SQL", "Excel", "Python", "Tableau", "Data Visualization"],
                    soft: ["Analytical Thinking", "Communication", "Attention to Detail"]
                },
                preferredEducation: [
                    {
                        level: "bachelor",
                        fields: ["Data Science", "Statistics", "Business Analytics"]
                    }
                ],
                experienceLevel: "entry",
                experienceYearsRange: { min: 0, max: 5 },
                salaryRange: { min: 55000, max: 95000, currency: "USD" },
                marketDemand: "high",
                growthOutlook: "growing",
                isActive: true
            },
            {
                careerName: "Web Developer",
                description: "Build and maintain websites and web applications",
                category: "technology",
                requiredSkills: {
                    technical: ["HTML", "CSS", "JavaScript", "React", "Responsive Design"],
                    soft: ["Creativity", "Communication", "Problem Solving"]
                },
                preferredEducation: [
                    {
                        level: "bachelor",
                        fields: ["Computer Science", "Web Development"]
                    }
                ],
                experienceLevel: "entry",
                experienceYearsRange: { min: 1, max: 6 },
                salaryRange: { min: 50000, max: 100000, currency: "USD" },
                marketDemand: "very-high",
                growthOutlook: "growing",
                isActive: true
            },
            {
                careerName: "Data Scientist",
                description: "Use machine learning and statistics to solve complex business problems",
                category: "technology",
                requiredSkills: {
                    technical: ["Python", "Machine Learning", "Statistics", "TensorFlow", "SQL"],
                    soft: ["Critical Thinking", "Communication", "Experimentation"]
                },
                preferredEducation: [
                    {
                        level: "master",
                        fields: ["Data Science", "Machine Learning", "Statistics"]
                    }
                ],
                experienceLevel: "mid",
                experienceYearsRange: { min: 2, max: 10 },
                salaryRange: { min: 85000, max: 140000, currency: "USD" },
                marketDemand: "very-high",
                growthOutlook: "rapid-growth",
                isActive: true
            },
            {
                careerName: "UX/UI Designer",
                description: "Design user-friendly interfaces and experiences for digital products",
                category: "creative",
                requiredSkills: {
                    technical: ["Figma", "Adobe XD", "Wireframing", "Prototyping", "CSS"],
                    soft: ["Creativity", "Empathy", "Communication", "Collaboration"]
                },
                preferredEducation: [
                    {
                        level: "bachelor",
                        fields: ["Design", "Graphic Design", "HCI"]
                    }
                ],
                experienceLevel: "entry",
                experienceYearsRange: { min: 0, max: 8 },
                salaryRange: { min: 50000, max: 110000, currency: "USD" },
                marketDemand: "high",
                growthOutlook: "growing",
                isActive: true
            },
            {
                careerName: "DevOps Engineer",
                description: "Manage infrastructure, deployment pipelines, and system reliability",
                category: "technology",
                requiredSkills: {
                    technical: ["Docker", "Kubernetes", "Linux", "CI/CD", "AWS/Cloud"],
                    soft: ["Problem Solving", "Automation Thinking", "Communication"]
                },
                preferredEducation: [
                    {
                        level: "bachelor",
                        fields: ["Computer Science", "Systems Engineering"]
                    }
                ],
                experienceLevel: "mid",
                experienceYearsRange: { min: 3, max: 10 },
                salaryRange: { min: 80000, max: 130000, currency: "USD" },
                marketDemand: "very-high",
                growthOutlook: "rapid-growth",
                isActive: true
            },
            {
                careerName: "Business Analyst",
                description: "Analyze business needs and recommend solutions to improve operations",
                category: "business",
                requiredSkills: {
                    technical: ["Excel", "SQL", "Tableau", "Requirements Gathering", "Process Analysis"],
                    soft: ["Communication", "Analytical Thinking", "Leadership"]
                },
                preferredEducation: [
                    {
                        level: "bachelor",
                        fields: ["Business", "Management", "Economics"]
                    }
                ],
                experienceLevel: "mid",
                experienceYearsRange: { min: 2, max: 8 },
                salaryRange: { min: 65000, max: 110000, currency: "USD" },
                marketDemand: "high",
                growthOutlook: "growing",
                isActive: true
            },
            {
                careerName: "Cloud Architect",
                description: "Design and implement cloud infrastructure solutions",
                category: "technology",
                requiredSkills: {
                    technical: ["AWS/Azure/GCP", "Infrastructure Design", "Security", "DevOps", "Networking"],
                    soft: ["Strategic Thinking", "Leadership", "Communication"]
                },
                preferredEducation: [
                    {
                        level: "master",
                        fields: ["Cloud Computing", "Computer Science"]
                    }
                ],
                experienceLevel: "senior",
                experienceYearsRange: { min: 5, max: 15 },
                salaryRange: { min: 120000, max: 180000, currency: "USD" },
                marketDemand: "very-high",
                growthOutlook: "rapid-growth",
                isActive: true
            }
        ];
        
        await Career.insertMany(defaultCareers);
        console.log(`[SEED] Successfully seeded ${defaultCareers.length} default careers`);
        return defaultCareers.length;
        
    } catch (error) {
        console.error("[SEED] Error seeding careers:", error.message);
        throw error;
    }
}

/**
 * Run seed function
 */
async function runSeed() {
    try {
        await connectDb();
        console.log("[SEED] Connected to database");
        
        const count = await seedDefaultCareers();
        console.log("[SEED] Seed completed successfully");
        
        process.exit(0);
    } catch (error) {
        console.error("[SEED] Seed failed:", error);
        process.exit(1);
    }
}

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runSeed();
}
