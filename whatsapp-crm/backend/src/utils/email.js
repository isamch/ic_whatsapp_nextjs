import nodemailer         from 'nodemailer'
import { emailTemplates } from '../templates/emailTemplates.js'

// Nodemailer transporter configured from SMTP env variables
const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Send an HTML email using a named template — throws if templateName not found
export const sendMail = async ({ to, subject, templateName, templateData }) => {
  if (!emailTemplates[templateName]) {
    throw new Error(`Email template '${templateName}' not found`)
  }

  const info = await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME ?? 'My App'}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html: emailTemplates[templateName](templateData),
  })

  return info
}
