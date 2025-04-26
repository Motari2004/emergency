import { NextApiRequest, NextApiResponse } from 'next';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';

// Initialize the Brevo API client
const apiKey = process.env.BREVO_API_KEY;
const client = SibApiV3Sdk.ApiClient.instance;
client.authentications['api-key'].apiKey = apiKey;

const senderEmail = 'your-email@example.com'; // Replace with your verified sender email

export default async function sendEmergencyEmail(req: NextApiRequest, res: NextApiResponse) {
  const { contacts, location, message } = req.body;

  if (!contacts || contacts.length === 0) {
    return res.status(400).json({ status: 'error', message: 'No contacts provided' });
  }

  const locationText = `Latitude: ${location.latitude}, Longitude: ${location.longitude}`;
  const subject = 'Emergency Alert: Immediate Attention Needed';
  const body = `${message}\n\nLocation: ${locationText}`;

  const emailData = {
    sender: { email: senderEmail },
    to: contacts.map(contact => ({ email: contact.email })),
    subject: subject,
    textContent: body,
  };

  try {
    // Use Brevo's transactional email API to send the email
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const response = await apiInstance.sendTransacEmail(emailData);

    return res.status(200).json({ status: 'success', message: 'Emergency emails sent' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to send emails' });
  }
}
