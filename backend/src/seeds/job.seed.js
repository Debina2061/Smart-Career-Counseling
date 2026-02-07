/**
 * Job Seed Data
 * Run: node src/seeds/job.seed.js
 */
import mongoose from "mongoose";
import { Job } from "../Model/job.model.js";
import { User } from "../Model/user.model.js";
import { envConfig } from "../Config/envConfig.js";

const jobs = [
    {
        jobTitle: "Senior Full Stack Developer",
        company: {
            name: "TechCorp Solutions",
            website: "https://techcorp.example.com"
        },
        description: "We are looking for an experienced Full Stack Developer to join our team. You will be responsible for developing and maintaining web applications using modern technologies.",
        requiredSkills: {
            technical: ["JavaScript", "React", "Node.js", "MongoDB", "TypeScript", "REST APIs", "Git"],
            soft: ["Problem Solving", "Communication", "Teamwork"]
        },
        preferredSkills: ["AWS", "Docker", "GraphQL"],
        experienceLevel: "senior",
        experienceYears: { min: 5, max: 10 },
        education: { level: "bachelor", fields: ["Computer Science", "Software Engineering"] },
        salaryRange: { min: 120000, max: 180000, currency: "USD", isVisible: true },
        location: { city: "San Francisco", state: "CA", country: "USA", isRemoteAllowed: true },
        workType: "hybrid",
        workCategory: "full-time",
        benefits: ["Health Insurance", "401k", "Remote Work", "Stock Options", "Unlimited PTO"],
        responsibilities: [
            "Design and implement scalable web applications",
            "Mentor junior developers",
            "Participate in code reviews",
            "Collaborate with product team"
        ],
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: "active"
    },
    {
        jobTitle: "Junior Data Scientist",
        company: {
            name: "DataInsights Inc",
            website: "https://datainsights.example.com"
        },
        description: "Entry-level position for passionate data enthusiasts. You'll work with our data science team to analyze datasets and build ML models.",
        requiredSkills: {
            technical: ["Python", "SQL", "Pandas", "NumPy", "Statistics"],
            soft: ["Analytical Thinking", "Curiosity", "Communication"]
        },
        preferredSkills: ["TensorFlow", "Machine Learning", "Data Visualization"],
        experienceLevel: "entry",
        experienceYears: { min: 0, max: 2 },
        education: { level: "bachelor", fields: ["Data Science", "Statistics", "Computer Science", "Mathematics"] },
        salaryRange: { min: 70000, max: 90000, currency: "USD", isVisible: true },
        location: { city: "New York", state: "NY", country: "USA", isRemoteAllowed: true },
        workType: "remote",
        workCategory: "full-time",
        benefits: ["Health Insurance", "Learning Budget", "Remote Work", "Flexible Hours"],
        responsibilities: [
            "Analyze large datasets",
            "Build and train ML models",
            "Create data visualizations",
            "Present findings to stakeholders"
        ],
        applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        status: "active"
    },
    {
        jobTitle: "UI/UX Designer",
        company: {
            name: "Creative Studio",
            website: "https://creativestudio.example.com"
        },
        description: "Looking for a creative UI/UX Designer to create beautiful and intuitive user experiences for our mobile and web applications.",
        requiredSkills: {
            technical: ["Figma", "Adobe XD", "Prototyping", "User Research", "Wireframing"],
            soft: ["Creativity", "Empathy", "Communication", "Attention to Detail"]
        },
        preferredSkills: ["HTML", "CSS", "Motion Design", "Sketch"],
        experienceLevel: "mid",
        experienceYears: { min: 2, max: 5 },
        education: { level: "any", fields: ["Design", "HCI", "Fine Arts"] },
        salaryRange: { min: 80000, max: 110000, currency: "USD", isVisible: true },
        location: { city: "Los Angeles", state: "CA", country: "USA", isRemoteAllowed: true },
        workType: "hybrid",
        workCategory: "full-time",
        benefits: ["Health Insurance", "Creative Tools Budget", "Flexible Hours", "Work From Home Fridays"],
        responsibilities: [
            "Design user interfaces for web and mobile",
            "Conduct user research and usability testing",
            "Create prototypes and wireframes",
            "Collaborate with developers"
        ],
        applicationDeadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        status: "active"
    },
    {
        jobTitle: "DevOps Engineer",
        company: {
            name: "CloudTech Systems",
            website: "https://cloudtech.example.com"
        },
        description: "Join our DevOps team to build and maintain our cloud infrastructure. You'll work with cutting-edge cloud technologies.",
        requiredSkills: {
            technical: ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux", "Terraform", "Python"],
            soft: ["Problem Solving", "Collaboration", "Communication"]
        },
        preferredSkills: ["Azure", "GCP", "Ansible", "Prometheus"],
        experienceLevel: "mid",
        experienceYears: { min: 3, max: 7 },
        education: { level: "bachelor", fields: ["Computer Science", "IT", "Systems Engineering"] },
        salaryRange: { min: 110000, max: 150000, currency: "USD", isVisible: true },
        location: { city: "Seattle", state: "WA", country: "USA", isRemoteAllowed: true },
        workType: "remote",
        workCategory: "full-time",
        benefits: ["Health Insurance", "401k Match", "Remote Work", "Conference Budget", "Home Office Stipend"],
        responsibilities: [
            "Design and maintain CI/CD pipelines",
            "Manage cloud infrastructure",
            "Implement security best practices",
            "Monitor system performance"
        ],
        applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        status: "active"
    },
    {
        jobTitle: "Product Manager",
        company: {
            name: "InnovateTech",
            website: "https://innovatetech.example.com"
        },
        description: "We need a strategic Product Manager to drive our product roadmap and work cross-functionally to deliver amazing products.",
        requiredSkills: {
            technical: ["Agile", "Jira", "Data Analysis", "Roadmapping", "A/B Testing"],
            soft: ["Leadership", "Communication", "Strategic Thinking", "Stakeholder Management"]
        },
        preferredSkills: ["SQL", "Figma", "Technical Background"],
        experienceLevel: "senior",
        experienceYears: { min: 5, max: 10 },
        education: { level: "bachelor", fields: ["Business", "Computer Science", "MBA"] },
        salaryRange: { min: 130000, max: 180000, currency: "USD", isVisible: true },
        location: { city: "Austin", state: "TX", country: "USA", isRemoteAllowed: false },
        workType: "onsite",
        workCategory: "full-time",
        benefits: ["Health Insurance", "401k", "Stock Options", "Parental Leave", "Gym Membership"],
        responsibilities: [
            "Define product vision and strategy",
            "Work with engineering and design teams",
            "Analyze user feedback and metrics",
            "Present to leadership"
        ],
        applicationDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: "active"
    },
    {
        jobTitle: "Backend Developer Intern",
        company: {
            name: "StartupX",
            website: "https://startupx.example.com"
        },
        description: "3-month paid internship for students or recent graduates interested in backend development.",
        requiredSkills: {
            technical: ["Python", "JavaScript", "SQL", "Git"],
            soft: ["Eagerness to Learn", "Teamwork", "Communication"]
        },
        preferredSkills: ["Node.js", "Django", "MongoDB"],
        experienceLevel: "entry",
        experienceYears: { min: 0, max: 1 },
        education: { level: "any", fields: ["Computer Science", "Software Engineering"] },
        salaryRange: { min: 25, max: 35, currency: "USD", isVisible: true }, // hourly
        location: { city: "Boston", state: "MA", country: "USA", isRemoteAllowed: true },
        workType: "hybrid",
        workCategory: "internship",
        benefits: ["Mentorship", "Learning Opportunities", "Flexible Hours", "Potential Full-time Offer"],
        responsibilities: [
            "Assist with API development",
            "Write unit tests",
            "Participate in code reviews",
            "Learn from senior developers"
        ],
        applicationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: "active"
    }
];

async function seedJobs() {
    try {
        await mongoose.connect(envConfig.mongoUrl);
        console.log("Connected to MongoDB");

        // Get or create a user to be the job creator
        let creator = await User.findOne({ Role: "admin" });
        
        if (!creator) {
            creator = await User.findOne();
        }
        
        if (!creator) {
            console.log("No users found. Please create a user first or run admin.seed.js");
            await mongoose.connection.close();
            process.exit(1);
        }

        console.log(`Using ${creator.email} as job creator`);

        // Clear existing jobs
        await Job.deleteMany({});
        console.log("Cleared existing jobs");

        // Add creator to each job
        const jobsWithCreator = jobs.map(job => ({
            ...job,
            createdBy: creator._id
        }));

        // Insert jobs
        const inserted = await Job.insertMany(jobsWithCreator);
        console.log(`\nSuccessfully seeded ${inserted.length} jobs:`);

        for (const job of inserted) {
            console.log(`  ✓ ${job.jobTitle} at ${job.company.name} (${job.workType})`);
        }

        await mongoose.connection.close();
        console.log("\nDatabase connection closed");
        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
}

seedJobs();
