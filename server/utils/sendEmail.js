import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config({ path: "./DLS.env" });
sgMail.setApiKey(process.env.DLS_SENDGRID_API_KEY);

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const msg = {
      to,
      from: "mehak.kotarya786@gmail.com", // verified sender
      subject,
      text,
      html,
    };
    await sgMail.send(msg);
  } catch (error) {
    console.error("Error sending email:", error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
};
