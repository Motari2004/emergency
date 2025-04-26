"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export default function SignupEmailForm() {
  const [email, setEmail] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    // Load email if it already exists in localStorage
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

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Update Your Email</h2>
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
  )
}
