import mongoose from "mongoose";
import { Career } from "./src/Model/carrerpath.model.js";

process.loadEnvFile(".env.local");

const DB_URL = process.env.DB_URL;

const careers = [
    {
        careerName: "Software Developer",
        description: "Develop and maintain software applications using various programming languages",
        category: "technology",
        requiredSkills: {
            technical: ["JavaScript", "React", "Node.js", "Git", "REST API"],
            soft: ["Problem Solving", "Communication", "Teamwork"]
        },
        preferredEducation: [{ level: "bachelor", fields: ["Computer Science", "Software Engineering"] }],
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
        category: "technology",
        requiredSkills: {
            technical: ["SQL", "Excel", "Python", "Tableau", "Data Visualization"],
            soft: ["Analytical Thinking", "Communication", "Attention to Detail"]
        },
        preferredEducation: [{ level: "bachelor", fields: ["Data Science", "Statistics", "Business Analytics"] }],
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
        preferredEducation: [{ level: "bachelor", fields: ["Computer Science", "Web Development"] }],
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
        preferredEducation: [{ level: "master", fields: ["Data Science", "Machine Learning", "Statistics"] }],
        experienceLevel: "mid",
        experienceYearsRange: { min: 2, max: 10 },
        salaryRange: { min: 85000, max: 140000, currency: "USD" },
        marketDemand: "very-high",
        growthOutlook: "rapid-growth",
        isActive: true
    },
    {
        careerName: "UX/UI Designer",
        description: "Design user interfaces and experiences for digital products",
        category: "creative",
        requiredSkills: {
            technical: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research"],
            soft: ["Creativity", "Empathy", "Communication"]
        },
        preferredEducation: [{ level: "bachelor", fields: ["Design", "Human-Computer Interaction", "Visual Design"] }],
        experienceLevel: "mid",
        experienceYearsRange: { min: 2, max: 7 },
        salaryRange: { min: 55000, max: 100000, currency: "USD" },
        marketDemand: "high",
        growthOutlook: "growing",
        isActive: true
    },
    {
        careerName: "DevOps Engineer",
        description: "Automate and streamline software development and deployment processes",
        category: "technology",
        requiredSkills: {
            technical: ["Docker", "Kubernetes", "CI/CD", "AWS", "Linux"],
            soft: ["Problem Solving", "Collaboration", "Continuous Learning"]
        },
        preferredEducation: [{ level: "bachelor", fields: ["Computer Science", "Information Technology"] }],
        experienceLevel: "mid",
        experienceYearsRange: { min: 3, max: 10 },
        salaryRange: { min: 75000, max: 130000, currency: "USD" },
        marketDemand: "very-high",
        growthOutlook: "rapid-growth",
        isActive: true
    },
    {
        careerName: "Digital Marketing Specialist",
        description: "Plan and execute digital marketing campaigns across various platforms",
        category: "business",
        requiredSkills: {
            technical: ["SEO", "Google Analytics", "Social Media", "Content Marketing", "Email Marketing"],
            soft: ["Creativity", "Communication", "Analytical Thinking"]
        },
        preferredEducation: [{ level: "bachelor", fields: ["Marketing", "Business", "Communications"] }],
        experienceLevel: "entry",
        experienceYearsRange: { min: 1, max: 5 },
        salaryRange: { min: 45000, max: 80000, currency: "USD" },
        marketDemand: "high",
        growthOutlook: "growing",
        isActive: true
    },
    {
        careerName: "Cybersecurity Analyst",
        description: "Protect organizations from cyber threats and security breaches",
        category: "technology",
        requiredSkills: {
            technical: ["Network Security", "Penetration Testing", "SIEM", "Firewalls", "Incident Response"],
            soft: ["Analytical Thinking", "Attention to Detail", "Problem Solving"]
        },
        preferredEducation: [{ level: "bachelor", fields: ["Cybersecurity", "Information Security", "Computer Science"] }],
        experienceLevel: "mid",
        experienceYearsRange: { min: 2, max: 8 },
        salaryRange: { min: 70000, max: 120000, currency: "USD" },
        marketDemand: "very-high",
        growthOutlook: "rapid-growth",
        isActive: true
    },
    {
        careerName: "Business Analyst",
        description: "Bridge the gap between business needs and technical solutions",
        category: "business",
        requiredSkills: {
            technical: ["SQL", "Requirements Analysis", "Process Modeling", "Agile", "Excel"],
            soft: ["Communication", "Critical Thinking", "Stakeholder Management"]
        },
        preferredEducation: [{ level: "bachelor", fields: ["Business Administration", "Information Systems", "Management"] }],
        experienceLevel: "mid",
        experienceYearsRange: { min: 2, max: 7 },
        salaryRange: { min: 60000, max: 100000, currency: "USD" },
        marketDemand: "high",
        growthOutlook: "stable",
        isActive: true
    },
    {
        careerName: "Mobile App Developer",
        description: "Create mobile applications for iOS and Android platforms",
        category: "technology",
        requiredSkills: {
            technical: ["React Native", "Swift", "Kotlin", "Mobile UI/UX", "REST API"],
            soft: ["Problem Solving", "Creativity", "Teamwork"]
        },
        preferredEducation: [{ level: "bachelor", fields: ["Computer Science", "Software Engineering", "Mobile Development"] }],
        experienceLevel: "mid",
        experienceYearsRange: { min: 2, max: 8 },
        salaryRange: { min: 65000, max: 115000, currency: "USD" },
        marketDemand: "very-high",
        growthOutlook: "growing",
        isActive: true
    }
];

async function seedCareers() {
    try {
        console.log("Connecting to database...");
        await mongoose.connect(DB_URL);
        console.log("Connected to database!");
        
        const count = await Career.countDocuments();
        console.log(`Found ${count} existing careers`);
        
        if (count > 0) {
            console.log("Career data already exists. Skipping seed.");
            process.exit(0);
        }
        
        console.log("Seeding careers...");
        await Career.insertMany(careers);
        console.log(`✅ Successfully seeded ${careers.length} careers!`);
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding careers:", error);
        process.exit(1);
    }
}

seedCareers();
