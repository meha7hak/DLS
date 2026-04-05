import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../DLS.env") });
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
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw new Error("Failed to send email via SendGrid");
  }
};
