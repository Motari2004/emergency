const express = require('express');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');

// Set up SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Use your SendGrid API Key here

const app = express();
app.use(cors());  // Allow cross-origin requests
app.use(express.json()); // To parse JSON requests

// POST endpoint to handle sending the email
app.post('/api/send-email', async (req, res) => {
  const { contacts, location, message } = req.body;

  try {
    // Prepare email content
    const emails = contacts.map((email) => ({
      to: email,
      from: 'youremail@example.com', // Your email address (configured with SendGrid)
      subject: 'Emergency Alert',
      text: `${message}\nLocation: Latitude: ${location.latitude}, Longitude: ${location.longitude}`,
    }));

    // Send the emails
    await sgMail.send(emails);
    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send emails' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
