const SibApiV3Sdk = require('sib-api-v3-sdk');

// 1. Get the default API client instance
const defaultClient = SibApiV3Sdk.ApiClient.instance;

// 2. Authenticate using Brevo API key from Render's environment
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

// 3. Create the *transactional* email API instance
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// This is the function our auth.js file calls
const sendEmail = async (options) => {
  // Create the email object
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.to = [{ email: options.to }];
  sendSmtpEmail.sender = { email: process.env.SEND_FROM_EMAIL, name: 'StreamHub Support' };
  sendSmtpEmail.subject = options.subject;
  sendSmtpEmail.htmlContent = options.html;

  try {
    // Send the email
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    // This log will now appear in your Render server logs
    console.log(' Email sent successfully to:', options.to);
  } catch (error) {
    // This log will also appear in your Render server logs
    console.error(' Error sending email:', error.response?.body || error.message);
    throw new Error('Email could not be sent.');
  }
};

module.exports = sendEmail;

