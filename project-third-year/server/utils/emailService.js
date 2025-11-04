const nodemailer = require('nodemailer');

/**
 * Sends an email using Nodemailer and Gmail.
 * The auth credentials are pulled from process.env.
 * @param {object} options - Email options.
 * @param {string} options.to - Recipient's email address.
 * @param {string} options.subject - Subject line of the email.
 * @param {string} options.html - HTML content of the email.
 */
const sendEmail = async (options) => {
  // 1. Create a transporter
  // This is the service that will send the email.
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your email from .env
      pass: process.env.EMAIL_PASS, // Your 16-character "App Password" from .env
    },
  });

  // 2. Define the email options
  // This is the actual email content.
  const mailOptions = {
    from: `StreamHub <${process.env.EMAIL_USER}>`, // Sender address (e.g., "StreamHub <streamhub.tech@gmail.com>")
    to: options.to,         // The user's email
    subject: options.subject, // The subject line
    html: options.html,     // The HTML body
  };

  // 3. Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    // This error will be caught by the .catch() block in your auth.js route
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;

