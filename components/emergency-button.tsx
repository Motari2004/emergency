"use client"

import { useState, useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function EmergencySystem() {
  const [email, setEmail] = useState("")
  const [isActivating, setIsActivating] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail")
    if (savedEmail) {
      setEmail(savedEmail)
    }
  }, [])

  const handleSaveEmail = () => {
    if (!email || !validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    localStorage.setItem("userEmail", email)

    toast({
      title: "Email saved",
      description: "Your email has been updated successfully!",
    })
  }

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleEmergencyClick = () => {
    setIsActivating(true)

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          triggerEmergency()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const cancelEmergency = () => {
    setIsActivating(false)
    setCountdown(3)
  }

  const sendEmailAlert = async (contacts: string[], location: { latitude: number, longitude: number }, senderEmail: string) => {
    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emergencyMessage: "Emergency alert: Immediate attention needed.",
          location: `Latitude: ${location.latitude}, Longitude: ${location.longitude}`,
          contacts,
          senderEmail,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send emergency email')
      }

      return response.json()
    } catch (error) {
      console.error("Error sending email alert:", error)
      throw error
    }
  }

  const triggerEmergency = async () => {
    setIsSending(true)

    try {
      const contacts = JSON.parse(localStorage.getItem("emergencyContacts") || "[]") as { name: string, email: string }[]
      const userEmail = localStorage.getItem("userEmail")

      if (!userEmail) {
        toast({
          title: "No user email found",
          description: "Please set your email first",
          variant: "destructive",
        })
        resetState()
        return
      }

      const contactEmails = contacts.map(contact => contact.email).filter(email => email)

      if (contactEmails.length === 0) {
        toast({
          title: "No emergency contacts found",
          description: "Please add emergency contacts in settings",
          variant: "destructive",
        })
        resetState()
        return
      }

      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by your browser")
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords

          await sendEmailAlert(contactEmails, { latitude, longitude }, userEmail)

          toast({
            title: "Emergency alert sent",
            description: `Alert sent to ${contactEmails.length} contact(s)`,
          })
          resetState()
        },
        (error) => {
          console.error(error)
          toast({
            title: "Location error",
            description: `Error getting location: ${error.message}`,
            variant: "destructive",
          })
          resetState()
        }
      )
    } catch (error) {
      toast({
        title: "Failed to send emergency alert",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
      resetState()
    }
  }

  const resetState = () => {
    setIsActivating(false)
    setCountdown(3)
    setIsSending(false)
  }

  return (
    <div className="flex flex-col items-center p-8 space-y-8">
      {/* Email Signup */}
      <div className="w-full max-w-md flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Set Your Email</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSaveEmail}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Save Email
        </button>
      </div>

      {/* Emergency Button */}
      {isActivating ? (
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold mb-4">Sending emergency alert in {countdown}...</div>
          <button
            onClick={cancelEmergency}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={handleEmergencyClick}
          disabled={isSending}
          className="relative w-64 h-64 rounded-full bg-red-600 hover:bg-red-700 shadow-lg transition-all hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:opacity-70"
        >
          <div className="absolute inset-0 rounded-full border-8 border-red-400 animate-pulse"></div>
          <div className="flex flex-col items-center justify-center h-full text-white">
            <AlertCircle size={48} className="mb-2" />
            <span className="text-2xl font-bold">EMERGENCY</span>
          </div>
        </button>
      )}
    </div>
  )
}
