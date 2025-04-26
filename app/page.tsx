"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [isSending, setIsSending] = useState(false);

  const handleEmergencyClick = async () => {
    const saved = localStorage.getItem("emergencyContacts");
    if (!saved) {
      alert("No emergency contacts saved. Please configure contacts first.");
      return;
    }

    const contacts: string[] = JSON.parse(saved);
    if (contacts.length === 0) {
      alert("No emergency contacts found. Please add some contacts.");
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch("/api/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Emergency! Please help me immediately!",
          contacts,
        }),
      });

      if (response.ok) {
        alert("Emergency SMS sent successfully!");
      } else {
        alert("Failed to send SMS. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while sending SMS.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Emergency Alert System</h1>
          <p className="text-gray-600">Press the button below in case of emergency</p>
        </div>

        <button
          onClick={handleEmergencyClick}
          disabled={isSending}
          className="bg-red-600 text-white font-bold py-2 px-6 rounded hover:bg-red-700 transition disabled:opacity-50"
        >
          {isSending ? "Sending..." : "Send Emergency SMS"}
        </button>

        <div className="mt-12 flex flex-col gap-4">
          <Link
            href="/how-it-works"
            className="text-blue-600 hover:text-blue-800 flex items-center justify-center gap-2"
          >
            <AlertTriangle size={16} />
            <span>How it works</span>
          </Link>

          <Link href="/settings" className="text-blue-600 hover:text-blue-800">
            Configure emergency contacts
          </Link>
        </div>
      </div>
    </main>
  );
}
