import { Career } from "./src/Model/carrerpath.model.js";
import mongoose from "mongoose";

const DB_URL = "mongodb+srv://sikkimdb_user:sikkim123@cluster0.taoemfc.mongodb.net/?appName=Cluster0";

async function quickSeed() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(DB_URL);
        console.log("✅ Connected to MongoDB");

        const count = await Career.countDocuments();
        console.log(`Current career count: ${count}`);

        if (count > 0) {
            console.log("⚠️ Careers already exist. Run db.careers.deleteMany({}) in mongosh to clear first.");
            process.exit(0);
        }

        console.log("Inserting 8 default careers...");

        const careers = [
            {
                careerName: "Software Developer",
                description: "Develop and maintain software applications",
                category: "technology",
                requiredSkills: { technical: ["JavaScript", "React", "Node.js"], soft: ["Problem Solving"] },
                preferredEducation: [{ level: "bachelor", fields: ["Computer Science"] }],
                experienceLevel: "mid",
                experienceYearsRange: { min: 2, max: 8 },
                salaryRange: { min: 60000, max: 120000, currency: "USD" },
                marketDemand: "very-high",
                growthOutlook: "rapid-growth",
                isActive: true
            },
            {
                careerName: "Data Analyst",
                description: "Analyze data for business insights",
                category: "finance",
                requiredSkills: { technical: ["SQL", "Excel", "Python"], soft: ["Analytical Thinking"] },
                preferredEducation: [{ level: "bachelor", fields: ["Statistics"] }],
                experienceLevel: "entry",
                experienceYearsRange: { min: 0, max: 5 },
                salaryRange: { min: 55000, max: 95000, currency: "USD" },
                marketDemand: "high",
                growthOutlook: "growing",
                isActive: true
            },
            {
                careerName: "Web Developer",
                description: "Build websites and web applications",
                category: "technology",
                requiredSkills: { technical: ["HTML", "CSS", "JavaScript"], soft: ["Creativity"] },
                preferredEducation: [{ level: "bachelor", fields: ["Computer Science"] }],
                experienceLevel: "entry",
                experienceYearsRange: { min: 1, max: 6 },
                salaryRange: { min: 50000, max: 100000, currency: "USD" },
                marketDemand: "very-high",
                growthOutlook: "growing",
                isActive: true
            },
            {
                careerName: "Data Scientist",
                description: "Use ML to solve business problems",
                category: "technology",
                requiredSkills: { technical: ["Python", "Machine Learning", "Statistics"], soft: ["Critical Thinking"] },
                preferredEducation: [{ level: "master", fields: ["Data Science"] }],
                experienceLevel: "mid",
                experienceYearsRange: { min: 2, max: 10 },
                salaryRange: { min: 85000, max: 140000, currency: "USD" },
                marketDemand: "very-high",
                growthOutlook: "rapid-growth",
                isActive: true
            },
            {
                careerName: "UX/UI Designer",
                description: "Design user-friendly interfaces",
                category: "creative",
                requiredSkills: { technical: ["Figma", "Adobe XD"], soft: ["Creativity", "Empathy"] },
                preferredEducation: [{ level: "bachelor", fields: ["Design"] }],
                experienceLevel: "entry",
                experienceYearsRange: { min: 0, max: 8 },
                salaryRange: { min: 50000, max: 110000, currency: "USD" },
                marketDemand: "high",
                growthOutlook: "growing",
                isActive: true
            },
            {
                careerName: "DevOps Engineer",
                description: "Manage infrastructure and deployments",
                category: "technology",
                requiredSkills: { technical: ["Docker", "Kubernetes", "AWS"], soft: ["Problem Solving"] },
                preferredEducation: [{ level: "bachelor", fields: ["Computer Science"] }],
                experienceLevel: "mid",
                experienceYearsRange: { min: 3, max: 10 },
                salaryRange: { min: 80000, max: 130000, currency: "USD" },
                marketDemand: "very-high",
                growthOutlook: "rapid-growth",
                isActive: true
            },
            {
                careerName: "Business Analyst",
                description: "Analyze business needs and solutions",
                category: "business",
                requiredSkills: { technical: ["Excel", "SQL"], soft: ["Communication"] },
                preferredEducation: [{ level: "bachelor", fields: ["Business"] }],
                experienceLevel: "entry",
                experienceYearsRange: { min: 0, max: 7 },
                salaryRange: { min: 55000, max: 105000, currency: "USD" },
                marketDemand: "high",
                growthOutlook: "growing",
                isActive: true
            },
            {
                careerName: "Cloud Architect",
                description: "Design cloud infrastructure solutions",
                category: "technology",
                requiredSkills: { technical: ["AWS", "Azure", "Cloud Architecture"], soft: ["Strategic Thinking"] },
                preferredEducation: [{ level: "bachelor", fields: ["Computer Science"] }],
                experienceLevel: "senior",
                experienceYearsRange: { min: 5, max: 15 },
                salaryRange: { min: 100000, max: 160000, currency: "USD" },
                marketDemand: "very-high",
                growthOutlook: "rapid-growth",
                isActive: true
            }
        ];

        await Career.insertMany(careers);
        console.log("✅ Successfully inserted 8 careers!");

        const newCount = await Career.countDocuments();
        console.log(`Total careers now: ${newCount}`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        console.error(error);
        process.exit(1);
    }
}

quickSeed();
