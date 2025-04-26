// pages/api/send-emergency.ts

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // adjust if path is different
import * as SibApiV3Sdk from 'sib-api-v3-sdk';

const brevoApiKey = process.env.BREVO_API_KEY;

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications['api-key'].apiKey = brevoApiKey;

export default async function sendEmergencyEmail(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  const { userId, location, message } = req.body;

  if (!userId || !location || !message) {
    return res.status(400).json({ status: 'error', message: 'Missing fields' });
  }

  try {
    // Fetch user and their emergency contacts
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { contacts: true },
    });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    if (user.contacts.length === 0) {
      return res.status(404).json({ status: 'error', message: 'No contacts found for this user' });
    }

    const senderEmail = user.email;
    const contacts = user.contacts.map((contact) => ({ email: contact.email }));

    const locationText = `Latitude: ${location.latitude}, Longitude: ${location.longitude}`;
    const subject = '🚨 Emergency Alert: Immediate Attention Needed 🚨';
    const body = `${message}\n\nLocation:\n${locationText}`;

    const emailData = {
      sender: { email: senderEmail },
      to: contacts,
      subject: subject,
      textContent: body,
    };

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    await apiInstance.sendTransacEmail(emailData);

    return res.status(200).json({ status: 'success', message: 'Emergency emails sent' });
  } catch (error) {
    console.error('Error sending emergency email:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}
