"use client"

import { useState } from "react"
import { AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function EmergencyButton() {
  const [isActivating, setIsActivating] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

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
          description: "Please log in or set up your email first",
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

  if (isActivating) {
    return (
      <div className="flex flex-col items-center">
        <div className="text-2xl font-bold mb-4">Sending emergency alert in {countdown}...</div>
        <button
          onClick={cancelEmergency}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
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
  )
}
