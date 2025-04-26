// /app/api/send-sms/route.ts
import { NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER!;

const client = twilio(accountSid, authToken);

export async function POST(req: Request) {
  const { to, message } = await req.json();

  try {
    const sms = await client.messages.create({
      body: message,
      from: twilioPhone,
      to: to.startsWith('+') ? to : `+254${to.substring(1)}`, // auto format
    });

    return NextResponse.json({ success: true, sid: sms.sid });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to send SMS" }, { status: 500 });
  }
}
