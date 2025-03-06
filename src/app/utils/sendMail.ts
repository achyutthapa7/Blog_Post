import nodemailer from "nodemailer";

export const sendMail = async (
  emailAddress: string,
  subject: string,
  verificationCode: number
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.Email,
    to: emailAddress,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #007bff;">Hello,</h2>
        <p style="font-size: 16px;">Here is your verification code:</p>
        <h1 style="text-align: center; color: #28a745;">${verificationCode}</h1>
        <p style="color: #555;">Enter this code to verify your email address.</p>
        <hr />
        <p style="font-size: 14px; color: #999;">&copy; ${new Date().getFullYear()} Your Company</p>
      </div>
    `,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent: %s", info.messageId);
    }
  });
};
