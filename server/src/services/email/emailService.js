// Email sending service using Nodemailer with Gmail SMTP.
// All email templates are defined here.

import nodemailer from "nodemailer";

// Create the transporter once and reuse it.
// Nodemailer is the library — it handles the SMTP connection.
// Gmail SMTP is the delivery mechanism — you need an App Password,
// not your regular Gmail password (Google requires this for SMTP access).
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for port 465, false for 587 (STARTTLS)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Sends the email verification email to a newly registered parent.
 * @param {string} toEmail - Parent's email address
 * @param {string} firstName - Parent's first name for personalization
 * @param {string} verificationToken - Plain text token for the URL
 */
export const sendVerificationEmail = async (toEmail, firstName, verificationToken) => {
  const transporter = createTransporter();

  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: "Verify your CodeQuest account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2563eb; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">CodeQuest</h1>
        </div>
        <div style="background-color: #f8fafc; padding: 32px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1e293b;">Hi ${firstName}, welcome to CodeQuest!</h2>
          <p style="color: #475569; line-height: 1.6;">
            Thank you for creating an account. Please verify your email address
            to get started and set up your child's learning profile.
          </p>
          
            href="${verificationUrl}"
            style="
              display: inline-block;
              background-color: #2563eb;
              color: white;
              padding: 14px 28px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: bold;
              margin: 16px 0;
            "
          >
            Verify my email
          </a>
          <p style="color: #94a3b8; font-size: 14px;">
            This link expires in 24 hours. If you did not create a CodeQuest account,
            you can safely ignore this email.
          </p>
          <p style="color: #94a3b8; font-size: 12px;">
            Or copy this link: ${verificationUrl}
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Sends a password reset email.
 * @param {string} toEmail
 * @param {string} firstName
 * @param {string} resetToken - Plain text token for the URL
 */
export const sendPasswordResetEmail = async (toEmail, firstName, resetToken) => {
  const transporter = createTransporter();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: "Reset your CodeQuest password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2563eb; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">CodeQuest</h1>
        </div>
        <div style="background-color: #f8fafc; padding: 32px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1e293b;">Hi ${firstName}, reset your password</h2>
          <p style="color: #475569; line-height: 1.6;">
            We received a request to reset your CodeQuest password.
            Click the button below to choose a new one.
          </p>
          
            href="${resetUrl}"
            style="
              display: inline-block;
              background-color: #2563eb;
              color: white;
              padding: 14px 28px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: bold;
              margin: 16px 0;
            "
          >
            Reset my password
          </a>
          <p style="color: #94a3b8; font-size: 14px;">
            This link expires in 1 hour. If you did not request a password reset,
            you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};