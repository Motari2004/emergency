import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { emergencyMessage, location, contacts } = req.body;

    // Create a transporter object using SMTP
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your_email@gmail.com', // Replace with your email
        pass: 'your_email_password',  // Replace with your password or App password
      },
    });

    // Setup email data
    const mailOptions = {
      from: 'your_email@gmail.com',  // sender address
      to: contacts.join(','),       // list of receivers
      subject: 'Emergency Alert',    // Subject line
      text: `Location: ${location}\nMessage: ${emergencyMessage}`,  // Plain text body
    };

    try {
      // Send the email
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send email' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
