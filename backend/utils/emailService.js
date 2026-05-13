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
  // Debug logging for configuration
  if (!EMAILJS_SERVICE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_PRIVATE_KEY) {
    console.error("❌ EmailJS Config Missing:", {
      service: !!EMAILJS_SERVICE_ID,
      public: !!EMAILJS_PUBLIC_KEY,
      private: !!EMAILJS_PRIVATE_KEY
    });
    throw new Error("Email service is currently unavailable.");
  }

  try {
    console.log(`📧 Attempting to send email via EmailJS (Template: ${templateId})...`);
    
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

    const responseText = await response.text();

    if (!response.ok) {
      console.error("❌ EmailJS API Error:", {
        status: response.status,
        text: responseText,
        template: templateId
      });
      throw new Error(`EmailJS failed with status ${response.status}: ${responseText}`);
    }

    console.log(`✅ Email sent successfully via EmailJS! Response: ${responseText}`);
    return { success: true };
  } catch (err) {
    console.error("❌ Email sending failed (Network/Other):", err.message);
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
 * Sends a login verification link.
 * Expects template ID 'login_verify' in EmailJS
 */
const sendLoginVerificationEmail = async (toEmail, verifyLink) => {
  return sendEmail({
    templateId: process.env.EMAILJS_VERIFY_TEMPLATE_ID || "login_verify",
    templateParams: {
      to_email: toEmail,
      verifyLink: verifyLink,
    },
  });
};

module.exports = {
  sendAuditConfirmationEmail,
  sendLoginVerificationEmail,
};
