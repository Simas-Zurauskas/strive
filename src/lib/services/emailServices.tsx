'use server';
import Mailjet from 'node-mailjet';
import mongoDb from '../mongo/db';
import UserModel from '../mongo/models/UserModel';

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_API_SECRET,
});

/**
 * Creates an HTML email template compatible with most email clients
 * @param title Email title/header
 * @param content Main email content (can include HTML)
 * @param buttonText Optional CTA button text
 * @param buttonUrl Optional CTA button URL
 * @returns Formatted HTML string for email
 */
const createEmailTemplate = (title: string, content: string, buttonText?: string, buttonUrl?: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; color: #333333; background-color: #ffffff;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <tr>
            <td style="text-align: center; padding: 20px 0;">
              <h1 style="color: #F5A623; margin: 0;">Strive</h1>
            </td>
          </tr>
          <tr>
            <td style="background-color: #ffffff; padding: 30px; border-radius: 10px; border: 1px solid #eeeeee;">
              <h2 style="color: #333333; margin-top: 0;">${title}</h2>
              <div style="color: #333333; line-height: 1.6;">
                ${content}
              </div>
              ${
                buttonText && buttonUrl
                  ? `<div style="text-align: center; margin-top: 30px;">
                      <a href="${buttonUrl}" style="display: inline-block; padding: 12px 24px; background-color: #F5A623; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 6px;">${buttonText}</a>
                    </div>`
                  : ''
              }
            </td>
          </tr>
          <tr>
            <td style="text-align: center; color: #666666; font-size: 12px; padding: 20px 0;">
              <p>© ${new Date().getFullYear()} Strive Learning. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

// Updated version of sendVerificationEmail using the template
export const sendVerificationEmail = async (email: string) => {
  await mongoDb();
  const dbUser = await UserModel.findOne({ email }).select('verificationSecretToken');

  if (!dbUser) {
    throw new Error('User not found');
  }

  const verificationSecretToken = dbUser.verificationSecretToken;
  const verificationUrl = `${
    process.env.NEXTAUTH_URL
  }/api/auth/verify-email?token=${verificationSecretToken}&id=${dbUser._id.toString()}`;

  const emailContent = createEmailTemplate(
    'Verify Your Email',
    `<p>Thank you for signing up with Strive! Please verify your email address to start creating your personalized learning roadmap.</p>`,
    'Verify Email',
    verificationUrl,
  );

  await mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'admin@strive-learning.com',
          Name: 'Strive',
        },
        To: [
          {
            Email: email,
          },
        ],
        Subject: 'Verify your email - Strive Learning',
        HTMLPart: emailContent,
      },
    ],
  });
};
