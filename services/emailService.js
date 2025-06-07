const nodemailer = require("nodemailer");
const pug = require("pug");
const path = require("path");

// Create transport configuration using environment variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendEventConfirmation = async (user, event) => {
  try {
    // Compile the pug template
    const templatePath = path.join(__dirname, "../emails/eventCreated.pug");
    const html = pug.renderFile(templatePath, { event });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Event Created Successfully!",
      html,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Event confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending event confirmation email:", error);
    throw error;
  }
};
