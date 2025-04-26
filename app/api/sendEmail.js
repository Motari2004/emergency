// /pages/api/sendEmail.ts

import type { NextApiRequest, NextApiResponse } from 'next'

// Dummy email sending function (replace with real email service later)
async function sendEmail({ contacts, emergencyMessage, location, senderEmail }: {
  contacts: string[],
  emergencyMessage: string,
  location: string,
  senderEmail: string
}) {
  console.log('Sending email...')
  console.log('From:', senderEmail)
  console.log('To:', contacts)
  console.log('Message:', emergencyMessage)
  console.log('Location:', location)
  
  // Simulate delay (optional)
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return { success: true }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const { contacts, emergencyMessage, location, senderEmail } = req.body

    // Basic validation
    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return res.status(400).json({ message: 'No contacts provided' })
    }
    if (!emergencyMessage || !location || !senderEmail) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    // Here you can integrate real email sending logic
    await sendEmail({ contacts, emergencyMessage, location, senderEmail })

    return res.status(200).json({ message: 'Emergency email sent successfully' })
  } catch (error) {
    console.error('Error sending emergency email:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
