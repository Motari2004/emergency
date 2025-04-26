import { NextResponse } from "next/server";
import { Resend } from "resend";

// Initialize Resend with your API key from .env
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  try {
    const { contacts, location, message } = await request.json();

    if (!contacts || !location || !message) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Send an email to each contact
    const sendEmailPromises = contacts.map((contact: string) => {
      return resend.emails.send({
        from: process.env.RESEND_EMAIL_FROM!, // <-- Pull from env, don't hardcode
        to: contact,
        subject: "Emergency Alert",
        text: `🚨 Emergency Alert 🚨\n\n${message}\n\n📍 Location:\nLatitude: ${location.latitude}\nLongitude: ${location.longitude}`,
      });
    });

    await Promise.all(sendEmailPromises);

    return NextResponse.json({ message: "Emails sent successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json({ message: "Failed to send email", error: error.message }, { status: 500 });
  }
}
