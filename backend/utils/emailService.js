const nodemailer = require("nodemailer");

/**
 * Sends a transactional confirmation email to the user.
 *
 * @param {string} toEmail - User's email address
 * @param {string} fullName - User's full name
 * @param {number} totalSavings - The estimated monthly savings found
 * @param {string} publicShareUrl - The public link to view their audit
 */
const sendAuditConfirmationEmail = async (toEmail, fullName, totalSavings, publicShareUrl) => {
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <h2 style="color: #0B3C5D;">AuditAI Complete: Here are your results!</h2>
      <p>Hi ${fullName},</p>
      <p>Your SaaS & AI spend audit has been successfully generated.</p>
      
      <div style="background-color: #f4f9fd; border-left: 5px solid #145DA0; padding: 15px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #145DA0;">Potential Savings Found: $${totalSavings}/mo</h3>
        <p style="margin-bottom: 0;">We identified specific optimization opportunities within your digital supply chain.</p>
      </div>

      <p>You can view your detailed breakdown, recommendations, and your personalized AI summary by accessing your secure public link below:</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${publicShareUrl}" style="background-color: #2E8BC0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Your Audit</a>
      </p>

      ${
        totalSavings > 500
          ? `<p style="background-color: #fffbeb; padding: 10px; border-radius: 5px;"><strong>Note:</strong> Because your potential savings exceed $500/mo, a member of the Credex team may reach out to help you capture these savings and negotiate enterprise rates.</p>`
          : ""
      }

      <p>Best regards,<br/>The AuditAI Team</p>
    </div>
  `;

  const dns = require('node:dns');
  const resolvedIp = await new Promise((resolve) => {
    dns.lookup('smtp.gmail.com', { family: 4 }, (err, address) => {
      resolve(address || '74.125.142.108');
    });
  });

  const transporter = nodemailer.createTransport({
    host: resolvedIp,
    port: 587,
    secure: false,
    servername: 'smtp.gmail.com',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000,
  });

  try {
    const info = await transporter.sendMail({
      from: `"AuditAI" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Your SaaS Spend Audit Results",
      html: emailHtml,
    });
    console.log("📧 Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Failed to send audit confirmation email:", error.message);
    throw error;
  }
};

module.exports = {
  sendAuditConfirmationEmail,
};
