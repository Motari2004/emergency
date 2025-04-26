import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma' // Import the Prisma client

async function handleSignup(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { email, password } = req.body

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password' })
  }

  try {
    // Check if the user already exists using Prisma
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert the new user into the database using Prisma
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    })

    return res.status(200).json({ message: 'User created successfully' })
  } catch (error) {
    console.error('Error during signup:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export default handleSignup
