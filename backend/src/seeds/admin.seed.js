/**
 * Admin Setup Script
 * Run: node src/seeds/admin.seed.js
 * 
 * This script creates a super admin user or promotes an existing user to super admin.
 */
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../Model/user.model.js";
import { Admin } from "../Model/admin.model.js";
import { envConfig } from "../Config/envConfig.js";

async function createSuperAdmin() {
    try {
        await mongoose.connect(envConfig.mongoUrl);
        console.log("Connected to MongoDB");

        // Check if super admin already exists
        const existingAdmin = await Admin.findOne({ adminLevel: "super-admin", isActive: true });
        if (existingAdmin) {
            const user = await User.findById(existingAdmin.userId);
            console.log(`Super admin already exists: ${user?.email}`);
            await mongoose.connection.close();
            process.exit(0);
        }


        let adminUser = await User.findOne({ email: adminEmail });

        if (!adminUser) {
            const hashedPassword = bcrypt.hashSync(adminPassword, 10);
            adminUser = await User.create({
                name: "Super Admin",
                email: adminEmail,
                password: hashedPassword,
                Role: "admin",
                authProvider: "local",
                isVerified: true
            });
            console.log(`Created admin user: ${adminEmail}`);
        } else {
            adminUser.Role = "admin";
            await adminUser.save();
            console.log(`Updated existing user to admin: ${adminEmail}`);
        }

        // Create admin record with full permissions
        const admin = await Admin.create({
            userId: adminUser._id,
            permissions: {
                manageUsers: true,
                manageJobs: true,
                manageCareers: true,
                viewAnalytics: true,
                manageAdmins: true,
                systemSettings: true
            },
            adminLevel: "super-admin",
            isActive: true
        });

        console.log("\n✓ Super Admin created successfully!");
        console.log("=====================================");
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        console.log(`Admin Level: super-admin`);
        console.log("=====================================");
        console.log("\n⚠️  Please change the password after first login!");

        await mongoose.connection.close();
        console.log("\nDatabase connection closed");
        process.exit(0);
    } catch (error) {
        console.error("Error creating super admin:", error);
        process.exit(1);
    }
}

createSuperAdmin();
