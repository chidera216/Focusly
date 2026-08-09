import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${process.env.API_URL}/api/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify your Pomodoro account",
    html: ` <h2>Verify your email</h2>

  <p>Click the link below to verify your Pomodoro account:</p>

  <a href="${verificationLink}">
    Verify my email
  </a>

  <p>This link will expire in 24 hours.</p>
`,
  });
};
