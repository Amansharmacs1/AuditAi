/**
 * Email Service using EmailJS REST API
 */

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;

/**
 * Generic internal function to send email via EmailJS REST API.
 */
const sendEmail = async ({ templateId, templateParams }) => {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_PRIVATE_KEY) {
    console.error("❌ EmailJS not configured: Missing Service ID, Public Key, or Private Key.");
    throw new Error("Email service is currently unavailable.");
  }

  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: templateId,
        user_id: EMAILJS_PUBLIC_KEY,
        accessToken: EMAILJS_PRIVATE_KEY,
        template_params: templateParams,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ EmailJS error:", errorText);
      throw new Error(`Failed to send email: ${errorText}`);
    }

    console.log(`📧 Email sent via EmailJS (Template: ${templateId})`);
    return { success: true };
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
    throw err;
  }
};

/**
 * Sends a transactional confirmation email to the user.
 * Expects template ID 'audit_results' in EmailJS
 */
const sendAuditConfirmationEmail = async (toEmail, fullName, totalSavings, publicShareUrl) => {
  return sendEmail({
    templateId: process.env.EMAILJS_AUDIT_TEMPLATE_ID || "audit_results",
    templateParams: {
      to_email: toEmail,
      fullName: fullName,
      totalSavings: totalSavings,
      publicShareUrl: publicShareUrl,
    },
  });
};

/**
 * Sends a password reset link.
 * Expects template ID 'password_reset' in EmailJS
 */
const sendPasswordResetEmail = async (toEmail, resetLink) => {
  return sendEmail({
    templateId: process.env.EMAILJS_RESET_TEMPLATE_ID || "password_reset",
    templateParams: {
      to_email: toEmail,
      resetLink: resetLink,
    },
  });
};

module.exports = {
  sendAuditConfirmationEmail,
  sendPasswordResetEmail,
};
