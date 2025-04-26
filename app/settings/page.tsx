import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import ContactForm from "@/components/contact-form"

export default function Settings() {
  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft size={16} className="mr-2" />
          Back to Emergency Button
        </Link>

        <h1 className="text-3xl font-bold mb-6">Emergency Contact Settings</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="mb-6 text-gray-700">
            Add phone numbers of people who should be notified in case of an emergency. These contacts will receive your
            location and an alert message.
          </p>

          <ContactForm />
        </div>
      </div>
    </main>
  )
}
