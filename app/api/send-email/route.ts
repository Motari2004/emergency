import { NextResponse } from "next/server";
import { Resend } from "resend";

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  try {
    const { contacts, location, message } = await request.json();

    if (!contacts || !location || !message) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Prepare emails for batch sending
    const batchEmails = contacts.map((contact: string) => ({
      from: process.env.RESEND_EMAIL_FROM!, // Your domain-verified email (example: alerts@yourdomain.com)
      to: [contact],
      subject: "🚨 Emergency Alert",
      html: `
        <h2>🚨 Emergency Alert 🚨</h2>
        <p>${message}</p>
        <p><strong>Location:</strong><br/>
        Latitude: ${location.latitude}<br/>
        Longitude: ${location.longitude}</p>
      `,
    }));

    // Send batch emails
    await resend.batch.send(batchEmails);

    return NextResponse.json({ message: "Emails sent successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json({ message: "Failed to send email", error: error.message }, { status: 500 });
  }
}
