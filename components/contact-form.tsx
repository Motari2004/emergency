"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Contact = {
  id: string
  name: string
  email: string
}

export default function ContactForm() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [newContact, setNewContact] = useState({ name: "", email: "" })
  const { toast } = useToast()

  useEffect(() => {
    const savedContacts = localStorage.getItem("emergencyContacts")
    if (savedContacts) {
      try {
        setContacts(JSON.parse(savedContacts))
      } catch (error) {
        console.error("Failed to parse contacts:", error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("emergencyContacts", JSON.stringify(contacts))
  }, [contacts])

  const addContact = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newContact.name.trim() || !newContact.email.trim()) {
      toast({
        title: "Invalid contact",
        description: "Both name and email address are required",
        variant: "destructive",
      })
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newContact.email)) {
      toast({
        title: "Invalid email address",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    const newId = Date.now().toString()
    setContacts([...contacts, { ...newContact, id: newId }])
    setNewContact({ name: "", email: "" })

    toast({
      title: "Contact added",
      description: `${newContact.name} has been added to your emergency contacts`,
    })
  }

  const removeContact = (id: string) => {
    const contactToRemove = contacts.find((contact) => contact.id === id)
    setContacts(contacts.filter((contact) => contact.id !== id))

    if (contactToRemove) {
      toast({
        title: "Contact removed",
        description: `${contactToRemove.name} has been removed from your emergency contacts`,
      })
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Emergency Contacts</h2>

      {contacts.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <p className="text-yellow-700">
            You haven't added any emergency contacts yet. Add at least one contact below.
          </p>
        </div>
      ) : (
        <ul className="space-y-3 mb-6">
          {contacts.map((contact) => (
            <li key={contact.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
              <div>
                <div className="font-medium">{contact.name}</div>
                <div className="text-gray-600 text-sm">{contact.email}</div>
              </div>
              <button
                onClick={() => removeContact(contact.id)}
                className="text-red-500 hover:text-red-700 p-1"
                aria-label={`Remove ${contact.name}`}
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={addContact} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Name
          </label>
          <input
            type="text"
            id="name"
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={newContact.email}
            onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="example@email.com"
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Add Contact
        </button>
      </form>
    </div>
  )
}
