import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail({ to, name, token }) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL;

  const verificationUrl = `${appUrl}/verify-email?token=${token}`;

  return transporter.sendMail({
    from: `"TrustOnes" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your TrustOnes account",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Verify your TrustOnes account</h2>

        <p>Hello ${name},</p>

        <p>Thank you for registering on TrustOnes. Please verify your email to activate your account.</p>

        <a 
          href="${verificationUrl}" 
          style="display:inline-block;padding:12px 18px;background:#111827;color:#ffffff;text-decoration:none;border-radius:8px;"
        >
          Verify Email
        </a>

        <p>If the button does not work, copy and paste this link into your browser:</p>

        <p>${verificationUrl}</p>

        <p>This link will expire in 1 hour.</p>
      </div>
    `,
  });
}