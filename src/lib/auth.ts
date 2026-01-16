import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";
// If your Prisma file is located elsewhere, you can change the path

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: "shamssarar27@gmail.com",
    pass: "ilks ydxw wwxo bzeo",
  },
});

const getVerificationEmailTemplate = (url: string, userName: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
        body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #51545e; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .content { background-color: #ffffff; padding: 40px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
        .button { display: inline-block; background-color: #3869D4; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 3px; font-weight: bold; margin-top: 20px; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b6e76; }
        .link-text { color: #3869D4; word-break: break-all; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Shams Workspace</h2>
        </div>
        
        <div class="content">
          <h1>Verify your email address</h1>
          <p>Hi ${userName},</p>
          <p>Thanks for starting an account with us. We want to make sure it's really you. Please click the button below to verify your email address.</p>
          
          <center>
            <a href="${url}" class="button" target="_blank">Verify Email</a>
          </center>
          
          <p style="margin-top: 30px;">If you didn't sign up for this account, you can safely ignore this email.</p>
          
          <hr style="border: none; border-top: 1px solid #eaeaec; margin: 20px 0;">
          
          <p style="font-size: 12px; color: #999;">If the button above doesn't work, copy and paste this link into your browser:</p>
          <p class="link-text" style="font-size: 12px;">${url}</p>
        </div>
        
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationURL = `${process.env.BETTER_AUTH_URL}/verify-email?token=${token}`;

        const emailTemplate = getVerificationEmailTemplate(
          verificationURL,
          user.name || "User"
        );

        console.log({ user, url, token });

        const info = await transporter.sendMail({
          from: '"Blog" <blogapp@ethereal.email>',
          to: user.email,
          subject: "Verify Your Email",
          text: `Hello ${user.name}, please verify your email by clicking on this link: ${verificationURL}`, // Plain-text version of the message
          html: emailTemplate, // HTML version of the message
        });
      } catch (err) {
        console.error("Error sending verification email:", err);
      }
    },
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: ["http://localhost:3000"],
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "user", required: true },
      phone: { type: "string", required: false },
      status: { type: "string", defaultValue: "active", required: false },
    },
  },
});
