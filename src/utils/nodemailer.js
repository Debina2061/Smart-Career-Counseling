import nodemailer from "nodemailer";
import { envConfig } from "../Config/envConfig.js";

const transporter = nodemailer.createTransport({
  secure: false,
  service: "gmail",
  auth: {
    user: envConfig.emailUser,
    pass: envConfig.emailPassword,
  },
});
export const SendMail = (body) => {
  transporter.sendMail({
    from: "Saugat Giri<saugatgiri1070@gmail.com>",
    to: body?.email,
    subject: body?.subject,
    html: body?.html,
  });
};