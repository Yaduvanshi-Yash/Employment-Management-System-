import nodemailer from "nodemailer";

const getMailConfig = () => ({
  user: process.env.GMAIL_USER?.trim() || "",
  pass: (process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, ""),
});

const hasMailConfig = () => {
  const { user, pass } = getMailConfig();
  return Boolean(user && pass);
};

const createTransporter = () => {
  const { user, pass } = getMailConfig();

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });
};

const getMailSetupHint = () =>
  "Check GMAIL_USER, use a valid Gmail App Password, and make sure Google 2-Step Verification is enabled.";

export const sendCredentialsEmail = async (personalEmail, workEmail, role) => {
  if (!hasMailConfig()) {
    console.warn("Skipping credentials email because Gmail SMTP is not configured.");
    return false;
  }

  try {
    const roleLabel = role === "admin" ? "Administrator" : "Employee";
    const transporter = createTransporter();

    const mailOptions = {
      from: getMailConfig().user,
      to: personalEmail,
      subject: `Your EMS Account Created - ${roleLabel}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Employee Management System</h2>

          <p style="color: #666;">Your account has been successfully created as a <strong>${roleLabel}</strong>.</p>

          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Your EMS Login Details</h3>

            <p style="margin: 10px 0;">
              <strong>Email:</strong><br/>
              <code style="background: white; padding: 8px; display: inline-block; border-radius: 4px;">${workEmail}</code>
            </p>

            <p style="margin: 10px 0;">
              <strong>Role:</strong><br/>
              <span style="background: white; padding: 8px; display: inline-block; border-radius: 4px;">${roleLabel}</span>
            </p>
          </div>

          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
            <strong>Security Note:</strong>
            <p style="margin: 10px 0; color: #856404;">
              For security, your password is never emailed. Use the password you created during signup.
            </p>
          </div>

          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            If you did not request this account, please contact your administrator immediately.
          </p>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;"/>

          <p style="color: #999; font-size: 12px;">
            Employee Management System | Secure Workforce Management Platform
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Credentials email sent to ${personalEmail}: ${info.response}`);
    return true;
  } catch (error) {
    console.error(`Failed to send credentials email. ${getMailSetupHint()}`, error);
    return false;
  }
};

export const testEmailConnection = async () => {
  if (!hasMailConfig()) {
    console.warn("Gmail SMTP check skipped because GMAIL_USER or GMAIL_APP_PASSWORD is missing.");
    return false;
  }

  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("Gmail SMTP connection verified successfully.");
    return true;
  } catch (error) {
    console.error(`Gmail SMTP connection failed. ${getMailSetupHint()}`, error);
    return false;
  }
};
