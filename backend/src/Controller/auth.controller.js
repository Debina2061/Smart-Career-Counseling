import { User } from "../Model/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import { Decryption, Encryption } from "../utils/encrypt.js";
import crypto from "crypto";
import { envConfig } from "../Config/envConfig.js";
import { SendMail } from "../utils/nodemailer.js";
import { uploadImageBuffer } from "../utils/cloudinary.js";
import { Profile } from "../Model/profile.model.js";
import jwt from "jsonwebtoken";
import { LoginVerify } from "../Model/loginVerify.model.js";
import { verifyEmail } from "../utils/templates/loginVerifyMail.js";
import { resetPasswordEmail } from "../utils/templates/resetPasswordMail.js";

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

const createEmailOtp = async (email, purpose) => {
  const otp = generateOtp();
  await LoginVerify.deleteMany({ email, purpose });
  await LoginVerify.create({
    email,
    token: otp,
    purpose,
    expiredAt: new Date(Date.now() + OTP_TTL_MS),
  });
  return otp;
};

const sendVerificationEmail = async (user) => {
  const otp = await createEmailOtp(user.email, "verify");
  const htmlContent = verifyEmail(user.email, otp);
  await SendMail({
    email: user.email,
    subject: "Verify your email — OTP Code",
    html: htmlContent,
  });
};

const sendResetPasswordEmail = async (user) => {
  const otp = await createEmailOtp(user.email, "reset");
  const htmlContent = resetPasswordEmail(user.email, otp);
  await SendMail({
    email: user.email,
    subject: "Password Reset — OTP Code",
    html: htmlContent,
  });
};

export const SignUp = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "User must be provided all fields for sign up",
    });
  }
  const regExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regExp.test(email)) {
    return res.status(400).json({
      message: "Please provide a valid email address",
    });
  }
  const existingUser = await User.findOne({ email: email }).select("-password");
  if (existingUser) {
    return res.status(401).json({
      message: "User with this email already exists",
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = await User.create({
    email: email,
    name: name,
    password: hashedPassword,
    authProvider: "local",
  });

  try {
    await sendVerificationEmail(newUser);
  } catch (err) {
    console.error("Verification email failed:", err?.message);
  }

  // Do NOT auto-login — require OTP verification first
  return res.status(201).json({
    message: "Account created. Please verify your email with the OTP sent to your inbox.",
    requiresVerification: true,
    user: {
      email: newUser.email,
      name: newUser.name,
    },
  });
};

export const LoginRequest = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "User must provide all fields for sign in",
    });
  }

  // Fetch user with password for validation
  const userWithPassword = await User.findOne({ email: email });
  if (!userWithPassword) {
    return res.status(404).json({
      message: "User with this email does not exist",
    });
  }

  const isPasswordValid = bcrypt.compareSync(
    password,
    userWithPassword.password,
  );

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid password",
    });
  }

  const jwtToken = jwt.sign(
    { _id: userWithPassword._id },
    envConfig.jwtSecretToken,
    { expiresIn: "1d" },
  );
  generateToken(jwtToken, res);

  // Return user without password
  const existingUser = await User.findOne({ email: email }).select("-password");
  return res.status(200).json({
    message: "Login successfully",
    token: jwtToken,
    user: {
      _id: existingUser._id,
      email: existingUser.email,
      name: existingUser.name,
      Role: existingUser.Role,
      isVerified: existingUser.isVerified,
      avatarUrl: existingUser.avatarUrl,
      authProvider: existingUser.authProvider,
    },
  });
};

export const SignOut = async (req, res) => {
  res.clearCookie("jwt");
  return res.status(200).json({
    message: "User signed out successfully",
  });
};

export const profile = async (req, res) => {
  const user = req.user;
  return res.status(200).json({
    message: "User profile fetched successfully",
    user,
  });
};

export const ChangePassword = async (req, res) => {
  const { _id: userId } = req.user;
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      message: "Old password and new password must be provided",
    });
  }
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  const isOldPasswordValid = Decryption(oldPassword, user.password);
  if (!isOldPasswordValid) {
    return res.status(401).json({
      message: "Old passsword is incorrect",
    });
  }
  const hashNewPassowrd = Encryption(newPassword);
  user.password = hashNewPassowrd;
  await user.save();
  return res.status(200).json({
    message: "Password changes successfully",
  });
};

export const loginVerify = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res
      .status(400)
      .json({ message: "Email and OTP must be provided" });
  }
  const verifyRecord = await LoginVerify.findOne({
    email: email,
    token: otp,
    purpose: "verify",
  });
  if (!verifyRecord) {
    return res.status(404).json({ message: "Invalid OTP" });
  }
  if (verifyRecord.expiredAt && verifyRecord.expiredAt < new Date()) {
    await LoginVerify.findByIdAndDelete(verifyRecord._id);
    return res.status(410).json({ message: "OTP has expired" });
  }
  await User.findOneAndUpdate({ email: email }, { $set: { isVerified: true } });
  await LoginVerify.findByIdAndDelete(verifyRecord._id);

  // Generate a JWT so the user is auto-logged-in after verification
  const verifiedUser = await User.findOne({ email }).select("-password");
  const jwtToken = jwt.sign({ _id: verifiedUser._id }, envConfig.jwtSecretToken, {
    expiresIn: "1d",
  });
  generateToken(jwtToken, res);

  return res.status(200).json({
    message: "Email verified successfully",
    token: jwtToken,
    user: {
      _id: verifiedUser._id,
      email: verifiedUser.email,
      name: verifiedUser.name,
      Role: verifiedUser.Role,
      isVerified: true,
      avatarUrl: verifiedUser.avatarUrl,
      authProvider: verifiedUser.authProvider,
    },
  });
};

export const resendOtp = async (req, res) => {
  const { email, purpose } = req.body;
  if (!email || !purpose) {
    return res.status(400).json({ message: "Email and purpose are required" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  try {
    if (purpose === "verify") {
      await sendVerificationEmail(user);
    } else if (purpose === "reset") {
      await sendResetPasswordEmail(user);
    } else {
      return res.status(400).json({ message: "Invalid purpose" });
    }
  } catch (err) {
    console.error("Resend OTP failed:", err?.message);
    return res.status(500).json({ message: "Failed to resend OTP" });
  }
  return res.status(200).json({ message: "OTP sent successfully" });
};

export const verifyEmailForgetPassword = async (req, res) => {
  const { email } = req.body;
  const userInfo = await User.findOne({ email: email });
  if (!userInfo) {
    return res.status(404).json({
      message: "User with this account is not found",
    });
  }
  try {
    await sendResetPasswordEmail(userInfo);
  } catch (err) {
    console.error("Reset password email failed:", err?.message);
  }
  return res.status(200).json({ message: "Password reset email sent" });
};

export const ForgetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      message: "Email, OTP, and new password must be provided",
    });
  }
  const resetRecord = await LoginVerify.findOne({
    email: email,
    token: otp,
    purpose: "reset",
  });
  if (!resetRecord) {
    return res.status(404).json({ message: "Invalid or expired OTP" });
  }
  if (resetRecord.expiredAt && resetRecord.expiredAt < new Date()) {
    await LoginVerify.findByIdAndDelete(resetRecord._id);
    return res.status(410).json({ message: "OTP has expired" });
  }
  const updateUser = await User.findOneAndUpdate(
    { email: email },
    {
      $set: {
        password: Encryption(newPassword),
      },
    },
    { new: true },
  );
  if (!updateUser) {
    return res.status(403).json({ message: "Error on forget password" });
  }
  await LoginVerify.findByIdAndDelete(resetRecord._id);
  return res.status(200).json({
    message: "Password reset successfully",
  });
};

export const deleteAccount = async (req, res) => {
  const userId = req.user._id;
  const email = req.user.email;

  try {
    // Lazy-import all related models to delete every piece of user data
    const { Profile } = await import("../Model/profile.model.js");
    const { Resume } = await import("../Model/resume.model.js");
    const { Recommendation } = await import("../Model/recommendation.model.js");
    const { ChatSession } = await import("../Model/chatbot.model.js");
    const { ATSScanHistory } = await import("../Model/atsScanHistory.model.js");

    await Promise.all([
      Profile.deleteMany({ userId }),
      Resume.deleteMany({ userId }),
      Recommendation.deleteMany({ userId }),
      ChatSession.deleteMany({ userId }),
      ATSScanHistory.deleteMany({ userId }),
      LoginVerify.deleteMany({ email }),
      User.findByIdAndDelete(userId),
    ]);

    res.clearCookie("jwt");
    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    return res.status(500).json({ message: "Failed to delete account" });
  }
};

export const updateProfile = async (req, res) => {
  const user = req.user;
  let result;
  if (req.file) {
    result = await uploadImageBuffer(req.file.buffer).catch((err) =>
      console.log(err),
    );
    if (result?.secure_url) {
      await User.findOneAndUpdate(
        { _id: user?._id },
        { $set: { avatarUrl: result.secure_url } },
      );
    }
  }
  const { age, educationLevel, gender, skills, interest, experience, name } = req.body;
  if (name) {
    await User.findOneAndUpdate(
      { _id: user?._id },
      { $set: { name: name } }
    );
  }
  const normalizeArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        return [value];
      }
    }
    return [];
  };
  const parsedSkills = normalizeArray(skills);
  const parsedInterest = normalizeArray(interest);
  let parsedExperience = experience;
  if (typeof experience === "string") {
    try {
      parsedExperience = JSON.parse(experience);
    } catch {
      parsedExperience = experience;
    }
  }
  const profileInformation = await Profile.findOneAndUpdate(
    { userId: user?._id },
    {
      $set: {
        age: age,
        educationLevel: educationLevel,
        gender: gender,
        interest: parsedInterest,
        experience: parsedExperience,
        skills: parsedSkills,
      },
    },
    { new: true, upsert: true },
  );
  return res.status(200).json({
    message: "update profile successfully.",
    avatarUrl: result?.secure_url,
  });
};
