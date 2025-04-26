// Add the "use client" directive at the top
'use client'

import { useState } from "react"
import { useRouter } from "next/router"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Please provide both email and password")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/login") // Redirect to login after successful signup
      } else {
        setError(data.message || "An error occurred during signup")
      }
    } catch (err) {
      setError("Internal server error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 bg-blue-600 text-white rounded-lg ${
              loading ? "bg-blue-400" : "hover:bg-blue-700"
            } transition-colors`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:text-blue-800">
            Log in
          </a>
        </p>
      </div>
    </div>
  )
}
