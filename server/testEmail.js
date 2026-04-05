import { sendEmail } from "./utils/sendEmail.js";

async function run() {
  console.log("Sending email...");
  await sendEmail({
    to: "test@example.com", 
    subject: "Test email",
    text: "This is a test.",
    html: "<p>This is a test.</p>"
  });
  console.log("Email sent.");
}
run();
