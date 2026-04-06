import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  if (!to || !subject || !html) {
    return {
      success: false,
      error: {
        message: "Missing required email fields: to, subject, html",
      },
    };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Smart Career Councelling <smart-career@debina-baraili.me>",
      to,
      subject,
      html,
    });

    if (error) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error?.message || "Failed to send email",
      },
    };
  }
};
