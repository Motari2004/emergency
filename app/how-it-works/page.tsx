import Link from "next/link"
import { ArrowLeft, MapPin, Bell, Users } from "lucide-react"

export default function HowItWorks() {
  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft size={16} className="mr-2" />
          Back to Emergency Button
        </Link>

        <h1 className="text-3xl font-bold mb-6">How It Works</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Emergency Alert System</h2>
          <p className="mb-6 text-gray-700">
            Our emergency alert system is designed to quickly notify your emergency contacts when you need help. Here's
            how the process works:
          </p>

          <div className="space-y-8">
            <div className="flex items-start">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <Bell className="text-red-600 h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">1. Press the Emergency Button</h3>
                <p className="text-gray-600">
                  When you're in an emergency situation, press the large red button on the home page. A 3-second
                  countdown will begin to prevent accidental triggers.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <MapPin className="text-blue-600 h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">2. Location Detection</h3>
                <p className="text-gray-600">
                  The system automatically detects your current location using your device's GPS. This location
                  information will be sent to your emergency contacts.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <Users className="text-green-600 h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">3. Alert Your Contacts</h3>
                <p className="text-gray-600">
                  Your emergency contacts will receive an SMS message with your emergency alert and a link to your exact
                  location on a map.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Setting Up Your Contacts</h2>
          <p className="mb-4 text-gray-700">
            Before using the emergency system, make sure to add your emergency contacts in the settings page. You can
            add multiple contacts who will be notified in case of an emergency.
          </p>
          <Link
            href="/settings"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Go to Settings
          </Link>
        </div>
      </div>
    </main>
  )
}
