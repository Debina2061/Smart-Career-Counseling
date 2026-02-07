/**
 * Career Seed Data
 * Run: node src/seeds/career.seed.js
 */
import mongoose from "mongoose";
import { Career } from "../Model/carrerpath.model.js";
import { envConfig } from "../Config/envConfig.js";

const careers = [
    {
        careerName: "Full Stack Developer",
        description: "Build both frontend and backend of web applications. Work with databases, APIs, and user interfaces.",
        category: "technology",
        requiredSkills: {
            technical: ["JavaScript", "React", "Node.js", "MongoDB", "SQL", "REST APIs", "Git", "HTML", "CSS"],
            soft: ["Problem Solving", "Communication", "Teamwork", "Time Management"]
        },
        preferredEducation: [
            { level: "bachelor", fields: ["Computer Science", "Software Engineering", "Information Technology"] },
            { level: "any", fields: [] }
        ],
        experienceLevel: "mid",
        experienceYearsRange: { min: 2, max: 6 },
        salaryRange: { min: 70000, max: 130000, currency: "USD" },
        marketDemand: "very-high",
        growthOutlook: "rapid-growth",
        certifications: ["AWS Certified Developer", "Meta Frontend Developer"],
        workEnvironment: ["remote", "hybrid"]
    },
    {
        careerName: "Data Scientist",
        description: "Analyze complex data sets to drive business decisions. Build machine learning models and derive insights.",
        category: "technology",
        requiredSkills: {
            technical: ["Python", "Machine Learning", "SQL", "TensorFlow", "Pandas", "NumPy", "Statistics", "Data Visualization"],
            soft: ["Analytical Thinking", "Communication", "Curiosity", "Attention to Detail"]
        },
        preferredEducation: [
            { level: "master", fields: ["Data Science", "Statistics", "Computer Science", "Mathematics"] },
            { level: "bachelor", fields: ["Computer Science", "Mathematics", "Physics"] }
        ],
        experienceLevel: "mid",
        experienceYearsRange: { min: 2, max: 7 },
        salaryRange: { min: 90000, max: 160000, currency: "USD" },
        marketDemand: "very-high",
        growthOutlook: "rapid-growth",
        certifications: ["Google Data Analytics", "IBM Data Science"],
        workEnvironment: ["remote", "hybrid", "onsite"]
    },
    {
        careerName: "UI/UX Designer",
        description: "Design user interfaces and experiences for digital products. Conduct user research and create prototypes.",
        category: "creative",
        requiredSkills: {
            technical: ["Figma", "Adobe XD", "Sketch", "Prototyping", "Wireframing", "User Research", "HTML", "CSS"],
            soft: ["Creativity", "Empathy", "Communication", "Collaboration"]
        },
        preferredEducation: [
            { level: "bachelor", fields: ["Design", "Human-Computer Interaction", "Psychology", "Fine Arts"] },
            { level: "any", fields: [] }
        ],
        experienceLevel: "mid",
        experienceYearsRange: { min: 1, max: 5 },
        salaryRange: { min: 60000, max: 110000, currency: "USD" },
        marketDemand: "high",
        growthOutlook: "growing",
        certifications: ["Google UX Design Certificate", "Nielsen Norman UX"],
        workEnvironment: ["remote", "hybrid"]
    },
    {
        careerName: "DevOps Engineer",
        description: "Bridge development and operations. Automate deployments, manage infrastructure, and ensure system reliability.",
        category: "technology",
        requiredSkills: {
            technical: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Terraform", "Jenkins", "Python", "Bash"],
            soft: ["Problem Solving", "Collaboration", "Adaptability", "Communication"]
        },
        preferredEducation: [
            { level: "bachelor", fields: ["Computer Science", "Information Technology", "Systems Engineering"] }
        ],
        experienceLevel: "mid",
        experienceYearsRange: { min: 3, max: 8 },
        salaryRange: { min: 85000, max: 150000, currency: "USD" },
        marketDemand: "very-high",
        growthOutlook: "rapid-growth",
        certifications: ["AWS Solutions Architect", "Kubernetes Administrator", "Docker Certified"],
        workEnvironment: ["remote", "hybrid", "onsite"]
    },
    {
        careerName: "Product Manager",
        description: "Define product vision and strategy. Work with engineering, design, and business teams to deliver products.",
        category: "business",
        requiredSkills: {
            technical: ["Agile", "Jira", "Data Analysis", "Roadmapping", "A/B Testing", "SQL"],
            soft: ["Leadership", "Communication", "Strategic Thinking", "Stakeholder Management", "Decision Making"]
        },
        preferredEducation: [
            { level: "bachelor", fields: ["Business", "Computer Science", "Engineering", "MBA"] },
            { level: "master", fields: ["MBA", "Product Management"] }
        ],
        experienceLevel: "senior",
        experienceYearsRange: { min: 4, max: 10 },
        salaryRange: { min: 100000, max: 180000, currency: "USD" },
        marketDemand: "high",
        growthOutlook: "growing",
        certifications: ["Certified Scrum Product Owner", "Product Management Certificate"],
        workEnvironment: ["hybrid", "onsite"]
    },
    {
        careerName: "Cybersecurity Analyst",
        description: "Protect systems and networks from cyber threats. Monitor security, respond to incidents, and implement safeguards.",
        category: "technology",
        requiredSkills: {
            technical: ["Network Security", "SIEM", "Penetration Testing", "Firewalls", "Linux", "Python", "Incident Response"],
            soft: ["Analytical Thinking", "Attention to Detail", "Problem Solving", "Communication"]
        },
        preferredEducation: [
            { level: "bachelor", fields: ["Cybersecurity", "Computer Science", "Information Security"] }
        ],
        experienceLevel: "mid",
        experienceYearsRange: { min: 2, max: 6 },
        salaryRange: { min: 75000, max: 130000, currency: "USD" },
        marketDemand: "very-high",
        growthOutlook: "rapid-growth",
        certifications: ["CISSP", "CEH", "CompTIA Security+", "OSCP"],
        workEnvironment: ["hybrid", "onsite"]
    },
    {
        careerName: "Mobile App Developer",
        description: "Build native or cross-platform mobile applications for iOS and Android devices.",
        category: "technology",
        requiredSkills: {
            technical: ["React Native", "Flutter", "Swift", "Kotlin", "JavaScript", "REST APIs", "Firebase", "Git"],
            soft: ["Problem Solving", "Creativity", "Attention to Detail", "Teamwork"]
        },
        preferredEducation: [
            { level: "bachelor", fields: ["Computer Science", "Software Engineering", "Mobile Development"] },
            { level: "any", fields: [] }
        ],
        experienceLevel: "mid",
        experienceYearsRange: { min: 1, max: 5 },
        salaryRange: { min: 65000, max: 120000, currency: "USD" },
        marketDemand: "high",
        growthOutlook: "growing",
        certifications: ["Google Associate Android Developer", "Meta React Native"],
        workEnvironment: ["remote", "hybrid"]
    },
    {
        careerName: "Machine Learning Engineer",
        description: "Design and implement ML systems. Train models, optimize algorithms, and deploy AI solutions.",
        category: "technology",
        requiredSkills: {
            technical: ["Python", "TensorFlow", "PyTorch", "Deep Learning", "MLOps", "AWS SageMaker", "Docker", "SQL"],
            soft: ["Research Skills", "Problem Solving", "Mathematics", "Communication"]
        },
        preferredEducation: [
            { level: "master", fields: ["Machine Learning", "Computer Science", "AI", "Mathematics"] },
            { level: "phd", fields: ["Machine Learning", "AI", "Computer Vision", "NLP"] }
        ],
        experienceLevel: "mid",
        experienceYearsRange: { min: 2, max: 7 },
        salaryRange: { min: 110000, max: 200000, currency: "USD" },
        marketDemand: "very-high",
        growthOutlook: "rapid-growth",
        certifications: ["AWS Machine Learning Specialty", "TensorFlow Developer Certificate"],
        workEnvironment: ["remote", "hybrid", "onsite"]
    },
    {
        careerName: "Financial Analyst",
        description: "Analyze financial data, create reports, and provide insights to guide business decisions.",
        category: "finance",
        requiredSkills: {
            technical: ["Excel", "Financial Modeling", "SQL", "Power BI", "Tableau", "Python", "Accounting"],
            soft: ["Analytical Thinking", "Attention to Detail", "Communication", "Time Management"]
        },
        preferredEducation: [
            { level: "bachelor", fields: ["Finance", "Accounting", "Economics", "Business"] },
            { level: "master", fields: ["Finance", "MBA"] }
        ],
        experienceLevel: "entry",
        experienceYearsRange: { min: 0, max: 4 },
        salaryRange: { min: 55000, max: 95000, currency: "USD" },
        marketDemand: "high",
        growthOutlook: "stable",
        certifications: ["CFA", "CPA", "Financial Modeling Certification"],
        workEnvironment: ["hybrid", "onsite"]
    },
    {
        careerName: "Digital Marketing Manager",
        description: "Plan and execute digital marketing campaigns. Manage SEO, social media, content, and paid advertising.",
        category: "business",
        requiredSkills: {
            technical: ["SEO", "Google Analytics", "Social Media Marketing", "Content Marketing", "PPC", "Email Marketing", "HubSpot"],
            soft: ["Creativity", "Communication", "Strategic Thinking", "Data Analysis"]
        },
        preferredEducation: [
            { level: "bachelor", fields: ["Marketing", "Communications", "Business", "Digital Media"] }
        ],
        experienceLevel: "mid",
        experienceYearsRange: { min: 3, max: 7 },
        salaryRange: { min: 60000, max: 110000, currency: "USD" },
        marketDemand: "high",
        growthOutlook: "growing",
        certifications: ["Google Analytics", "HubSpot Inbound Marketing", "Meta Blueprint"],
        workEnvironment: ["remote", "hybrid"]
    },
    {
        careerName: "Cloud Solutions Architect",
        description: "Design and implement cloud infrastructure solutions. Ensure scalability, security, and cost optimization.",
        category: "technology",
        requiredSkills: {
            technical: ["AWS", "Azure", "GCP", "Terraform", "Kubernetes", "Networking", "Security", "Python"],
            soft: ["Strategic Thinking", "Communication", "Problem Solving", "Leadership"]
        },
        preferredEducation: [
            { level: "bachelor", fields: ["Computer Science", "Information Technology", "Cloud Computing"] }
        ],
        experienceLevel: "senior",
        experienceYearsRange: { min: 5, max: 12 },
        salaryRange: { min: 130000, max: 200000, currency: "USD" },
        marketDemand: "very-high",
        growthOutlook: "rapid-growth",
        certifications: ["AWS Solutions Architect Professional", "Azure Solutions Architect", "GCP Professional Cloud Architect"],
        workEnvironment: ["remote", "hybrid"]
    },
    {
        careerName: "Backend Developer",
        description: "Build server-side applications, APIs, and database systems that power web and mobile applications.",
        category: "technology",
        requiredSkills: {
            technical: ["Node.js", "Python", "Java", "SQL", "MongoDB", "REST APIs", "GraphQL", "Docker", "Redis"],
            soft: ["Problem Solving", "Logical Thinking", "Teamwork", "Communication"]
        },
        preferredEducation: [
            { level: "bachelor", fields: ["Computer Science", "Software Engineering"] },
            { level: "any", fields: [] }
        ],
        experienceLevel: "mid",
        experienceYearsRange: { min: 2, max: 6 },
        salaryRange: { min: 70000, max: 130000, currency: "USD" },
        marketDemand: "very-high",
        growthOutlook: "growing",
        certifications: ["AWS Developer", "Node.js Certification"],
        workEnvironment: ["remote", "hybrid"]
    },
    {
        careerName: "Healthcare Administrator",
        description: "Manage healthcare facilities and services. Oversee operations, budgets, and regulatory compliance.",
        category: "healthcare",
        requiredSkills: {
            technical: ["Healthcare Management", "Budgeting", "Regulatory Compliance", "EHR Systems", "Data Analysis"],
            soft: ["Leadership", "Communication", "Problem Solving", "Decision Making"]
        },
        preferredEducation: [
            { level: "bachelor", fields: ["Healthcare Administration", "Public Health", "Business"] },
            { level: "master", fields: ["Healthcare Administration", "MBA", "Public Health"] }
        ],
        experienceLevel: "senior",
        experienceYearsRange: { min: 5, max: 15 },
        salaryRange: { min: 70000, max: 140000, currency: "USD" },
        marketDemand: "high",
        growthOutlook: "growing",
        certifications: ["FACHE", "CPHQ"],
        workEnvironment: ["onsite", "hybrid"]
    },
    {
        careerName: "Content Writer",
        description: "Create engaging written content for websites, blogs, social media, and marketing materials.",
        category: "creative",
        requiredSkills: {
            technical: ["SEO Writing", "Content Management Systems", "Research", "Editing", "Social Media"],
            soft: ["Creativity", "Communication", "Time Management", "Attention to Detail"]
        },
        preferredEducation: [
            { level: "bachelor", fields: ["English", "Journalism", "Communications", "Marketing"] },
            { level: "any", fields: [] }
        ],
        experienceLevel: "entry",
        experienceYearsRange: { min: 0, max: 3 },
        salaryRange: { min: 40000, max: 70000, currency: "USD" },
        marketDemand: "medium",
        growthOutlook: "stable",
        certifications: ["HubSpot Content Marketing", "Google Analytics"],
        workEnvironment: ["remote", "hybrid"]
    },
    {
        careerName: "Mechanical Engineer",
        description: "Design, develop, and test mechanical systems and devices for various industries.",
        category: "engineering",
        requiredSkills: {
            technical: ["CAD", "SolidWorks", "AutoCAD", "MATLAB", "Thermodynamics", "Manufacturing Processes", "FEA"],
            soft: ["Problem Solving", "Analytical Thinking", "Teamwork", "Communication"]
        },
        preferredEducation: [
            { level: "bachelor", fields: ["Mechanical Engineering", "Engineering"] },
            { level: "master", fields: ["Mechanical Engineering"] }
        ],
        experienceLevel: "mid",
        experienceYearsRange: { min: 2, max: 8 },
        salaryRange: { min: 65000, max: 110000, currency: "USD" },
        marketDemand: "high",
        growthOutlook: "stable",
        certifications: ["PE License", "Six Sigma"],
        workEnvironment: ["onsite", "hybrid"]
    }
];

async function seedCareers() {
    try {
        await mongoose.connect(envConfig.mongoUrl);
        console.log("Connected to MongoDB");
        
        // Clear existing careers
        await Career.deleteMany({});
        console.log("Cleared existing careers");
        
        // Insert new careers
        const inserted = await Career.insertMany(careers);
        console.log(`Successfully seeded ${inserted.length} careers`);
        
        // List them
        for (const career of inserted) {
            console.log(`  ✓ ${career.careerName} (${career.category})`);
        }
        
        await mongoose.connection.close();
        console.log("\nDatabase connection closed");
        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
}

seedCareers();
