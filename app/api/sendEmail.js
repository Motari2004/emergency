export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { emergencyMessage, location, contacts, senderEmail } = req.body;
  
      try {
        const promises = contacts.map(async (email) => {
          const response = await fetch('https://api.saleshandy.com/v1/email/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': '4af38d4c958b93c3fc0c436b38bcdf7a',
            },
            body: JSON.stringify({
              to: email,
              subject: 'Emergency Alert!',
              body: `Location: ${location}\n\nMessage: ${emergencyMessage}`,
              sender: senderEmail, // dynamically passed from frontend
            }),
          });
  
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || 'Failed to send email');
          }
          return data;
        });
  
        await Promise.all(promises);
  
        res.status(200).json({ message: 'Emails sent successfully' });
      } catch (error) {
        console.error('Email sending failed:', error);
        res.status(500).json({ error: 'Failed to send emails' });
      }
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  }
  