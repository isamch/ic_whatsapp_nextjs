/**
 * @module emailTemplates
 * @description HTML email templates used by sendMail().
 * Each key is a template name, each value is a function that receives
 * dynamic data and returns an HTML string.
 *
 * To add a new template:
 *   1. Add a new key to emailTemplates
 *   2. Return an HTML string using the templateData fields
 *
 * @example
 * emailTemplates['verification']({ name: 'John', code: '482910' })
 * // → '<html>...<p>Hi John, your code is 482910</p>...</html>'
 */
export const emailTemplates = {

  /**
   * Email verification OTP template.
   *
   * @param {{ name: string, code: string }} data
   * @returns {string} HTML string
   */
  verification: ({ name, code }) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Email Verification</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Your verification code is:</p>
      <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 16px; background: #f4f4f4; text-align: center; border-radius: 8px;">
        ${code}
      </div>
      <p>This code expires in <strong>10 minutes</strong>.</p>
      <p>If you did not request this, please ignore this email.</p>
    </div>
  `,

  /**
   * Password reset link template.
   *
   * @param {{ name: string, resetUrl: string }} data
   * @returns {string} HTML string
   */
  passwordReset: ({ name, resetUrl }) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Click the button below to reset your password. This link expires in <strong>10 minutes</strong>.</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
        Reset Password
      </a>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p style="color: #888; font-size: 12px;">Or copy this link: ${resetUrl}</p>
    </div>
  `,

}
