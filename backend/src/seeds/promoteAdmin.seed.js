/**
 * Promote an existing user to admin and create admin permissions.
 *
 * Usage:
 *   node src/seeds/promoteAdmin.seed.js --email user@example.com --level admin
 *
 * Optional env vars:
 *   ADMIN_EMAIL, ADMIN_LEVEL
 */
import mongoose from "mongoose";
import { User } from "../Model/user.model.js";
import { Admin } from "../Model/admin.model.js";
import { envConfig } from "../Config/envConfig.js";

const getArg = (name) => {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  return process.argv[index + 1] || null;
};

const email =
  getArg("--email") ||
  getArg("-e") ||
  process.env.ADMIN_EMAIL ||
  "";

const adminLevel =
  getArg("--level") ||
  process.env.ADMIN_LEVEL ||
  "admin";

const buildPermissions = (level) => {
  if (level === "super-admin") {
    return {
      manageUsers: true,
      manageJobs: true,
      manageCareers: true,
      viewAnalytics: true,
      manageAdmins: true,
      systemSettings: true,
    };
  }

  return {
    manageUsers: true,
    manageJobs: true,
    manageCareers: true,
    viewAnalytics: true,
    manageAdmins: false,
    systemSettings: false,
  };
};

async function promoteAdmin() {
  try {
    if (!email) {
      console.error("Missing email. Use --email user@example.com");
      process.exit(1);
    }

    await mongoose.connect(envConfig.mongoUrl);
    console.log("Connected to MongoDB");

    const user = await User.findOne({ email });
    if (!user) {
      console.error(`User not found for email: ${email}`);
      process.exit(1);
    }

    user.Role = "admin";
    await user.save();

    const permissions = buildPermissions(adminLevel);
    let adminRecord = await Admin.findOne({ userId: user._id });

    if (!adminRecord) {
      adminRecord = await Admin.create({
        userId: user._id,
        permissions,
        adminLevel,
        isActive: true,
      });
      console.log("Admin record created.");
    } else {
      adminRecord.permissions = permissions;
      adminRecord.adminLevel = adminLevel;
      adminRecord.isActive = true;
      await adminRecord.save();
      console.log("Admin record updated.");
    }

    console.log("✓ User promoted to admin:", email);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error promoting admin:", error);
    process.exit(1);
  }
}

promoteAdmin();
