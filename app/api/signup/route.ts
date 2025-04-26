import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'

const prisma = new PrismaClient()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Make sure your .env contains this variable
})

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
    // Check if the user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert the new user into the database
    await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [
      email,
      hashedPassword,
    ])

    return res.status(200).json({ message: 'User created successfully' })
  } catch (error) {
    console.error('Error during signup:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export default handleSignup
