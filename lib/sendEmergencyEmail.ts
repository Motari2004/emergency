'use server'

import SibApiV3Sdk from 'sib-api-v3-sdk'

export async function sendEmergencyEmail(contacts: string[], location: { latitude: number, longitude: number }) {
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.BREVO_API_KEY; // Your Brevo API Key from environment variables

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.to = contacts.map(email => ({ email }));

  // ⛔ You cannot access localStorage directly here (server code has no window object)
  // ✅ Solution: Pass the senderEmail from client side when calling this function

  // Example:
  const senderEmail = contacts[0]; // or pass sender separately if needed

  sendSmtpEmail.sender = { name: 'Emergency Alert', email: senderEmail }; 
  sendSmtpEmail.subject = '🚨 Emergency Alert: Immediate Attention Needed!';
  sendSmtpEmail.htmlContent = `
    <h1>🚨 Emergency Alert</h1>
    <p>The user has triggered an emergency alert.</p>
    <p><strong>Location:</strong> Latitude ${location.latitude}, Longitude ${location.longitude}</p>
    <p>Please take immediate action!</p>
  `;

  await apiInstance.sendTransacEmail(sendSmtpEmail);
}
