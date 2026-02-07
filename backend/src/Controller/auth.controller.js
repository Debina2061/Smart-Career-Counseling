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

const EMAIL_TOKEN_TTL_MS = 5 * 60 * 1000; // 5 minutes

const createEmailToken = async (email, purpose) => {
  const token = crypto.randomBytes(20).toString("hex");
  await LoginVerify.deleteMany({ email, purpose });
  await LoginVerify.create({
    email,
    token,
    purpose,
    expiredAt: new Date(Date.now() + EMAIL_TOKEN_TTL_MS),
  });
  return token;
};

const sendVerificationEmail = async (user) => {
  const token = await createEmailToken(user.email, "verify");
  const verifyLink = `${envConfig.backendUrl}/auth/verify-token?email=${encodeURIComponent(
    user.email,
  )}&token=${token}`;
  const htmlContent = verifyEmail(user.email, verifyLink);
  await SendMail({
    email: user.email,
    subject: "Verify your email",
    html: htmlContent,
  });
};

const sendResetPasswordEmail = async (user) => {
  const token = await createEmailToken(user.email, "reset");
  const baseUrl = envConfig.frontendUrl || envConfig.backendUrl;
  const resetLink = `${baseUrl}/reset-password?email=${encodeURIComponent(
    user.email,
  )}&token=${token}`;
  const htmlContent = resetPasswordEmail(user.email, resetLink);
  await SendMail({
    email: user.email,
    subject: "Reset your password",
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

  // Generate token and auto-login the user
  const jwtToken = jwt.sign({ _id: newUser._id }, envConfig.jwtSecretToken, {
    expiresIn: "1d",
  });
  generateToken(jwtToken, res);

  return res.status(201).json({
    message: "User created successfully",
    token: jwtToken,
    user: {
      _id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      Role: newUser.Role,
      isVerified: newUser.isVerified,
      avatarUrl: newUser.avatarUrl,
      authProvider: newUser.authProvider,
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
  const { email, token } = req.query;
  if (!email || !token) {
    return res
      .status(400)
      .json({ message: "Email and token must be provided" });
  }
  const verifyToken = await LoginVerify.findOne({
    email: email,
    token: token,
    purpose: "verify",
  });
  if (!verifyToken) {
    return res.status(404).json({ message: "Email and token do not match" });
  }
  if (verifyToken.expiredAt && verifyToken.expiredAt < new Date()) {
    await LoginVerify.findByIdAndDelete(verifyToken._id);
    return res.status(410).json({ message: "Token has expired" });
  }
  await User.findOneAndUpdate({ email: email }, { $set: { isVerified: true } });
  await LoginVerify.findByIdAndDelete(verifyToken._id);
  return res.status(200).json({ message: "Email verified successfully" });
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
  const { email, token } = req.query;
  const { newPassword } = req.body;
  if (!email || !token || !newPassword) {
    return res.status(400).json({
      message: "email, token, and new password must be provided",
    });
  }
  const resetToken = await LoginVerify.findOne({
    email: email,
    token: token,
    purpose: "reset",
  });
  if (!resetToken) {
    return res.status(404).json({ message: "Invalid or expired reset token" });
  }
  if (resetToken.expiredAt && resetToken.expiredAt < new Date()) {
    await LoginVerify.findByIdAndDelete(resetToken._id);
    return res.status(410).json({ message: "Reset token has expired" });
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
  await LoginVerify.findByIdAndDelete(resetToken._id);
  return res.status(200).json({
    message: "password reset successfully",
  });
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
