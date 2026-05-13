const { Resend } = require("resend");

// Initialize Resend if API key is present
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Generic internal function to send email via Resend.
 */
const sendEmail = async ({ to, subject, html }) => {
  if (!resend) {
    console.error("❌ Resend not initialized: RESEND_API_KEY is missing.");
    throw new Error("Email service is currently unavailable.");
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const fromName = "AuditAI";

  try {
    const { data, error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("❌ Resend error:", error);
      throw new Error(error.message || "Failed to send email via Resend");
    }

    console.log("📧 Email sent via Resend:", data.id);
    return data;
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
    throw err;
  }
};

/**
 * Sends a transactional confirmation email to the user.
 */
const sendAuditConfirmationEmail = async (toEmail, fullName, totalSavings, publicShareUrl) => {
  const html = `
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
          ? `<p style="background-color: #fffbeb; padding: 10px; border-radius: 5px;"><strong>Note:</strong> Because your potential savings exceed $500/mo, a member of the Credex team may reach out to help you capture these savings.</p>`
          : ""
      }

      <p>Best regards,<br/>The AuditAI Team</p>
    </div>
  `;

  return sendEmail({ to: toEmail, subject: "Your SaaS Spend Audit Results", html });
};

/**
 * Sends a login verification link.
 */
const sendLoginVerificationEmail = async (toEmail, verifyLink) => {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #145DA0;">Welcome to AuditAI 🚀</h2>
      <p>Click the button below to login to your dashboard.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyLink}" style="background-color: #145DA0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
          Verify & Login
        </a>
      </div>
      <p style="color: #666; font-size: 14px;">This link expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;

  return sendEmail({ to: toEmail, subject: "AuditAI Login Verification", html });
};

/**
 * Sends a password reset link.
 */
const sendPasswordResetEmail = async (toEmail, resetLink) => {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #145DA0;">Reset your AuditAI password</h2>
      <p>Click the button below to set a new password for your account.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #145DA0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
          Reset Password
        </a>
      </div>
      <p style="color: #666; font-size: 14px;">This link expires in 10 minutes.</p>
    </div>
  `;

  return sendEmail({ to: toEmail, subject: "AuditAI Password Reset", html });
};

module.exports = {
  sendAuditConfirmationEmail,
  sendLoginVerificationEmail,
  sendPasswordResetEmail,
};

