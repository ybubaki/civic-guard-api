const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  // Create a transporter for SMTP
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Send the email
  const mailOptions = {
    from: "Civic Guard <" + process.env.SMTP_USER + ">",
    to,
    subject,
    html: text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    console.log("Email sent to: " + to);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  sendEmail,
};
