import Link from "next/link"
import EmergencyButton from "@/components/emergency-button"
import { AlertTriangle } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md mx-auto text-center">
        {/* Signup Button at the top */}
        <div className="absolute top-4 right-4">
          <Link
            href="/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-lg transition-colors"
          >
            Sign Up
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Emergency Alert System</h1>
          <p className="text-gray-600">Press the button below in case of emergency</p>
        </div>

        {/* Emergency Button */}
        <EmergencyButton />

        {/* Additional Links */}
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
  )
}
