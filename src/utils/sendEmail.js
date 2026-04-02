import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.DLS_SENDGRID_API_KEY);

export const sendEmail = async ({ to, subject, text, html }) => {
    return sgMail.send({
        to,
        from: "mehak.kotarya786@gmail.com", // MUST match verified sender
        subject,
        text,
        html,
    });
};