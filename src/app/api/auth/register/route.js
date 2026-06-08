import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/dbConnect'
import User from '@/models/user'
import bcrypt from 'bcryptjs'

export const POST = async (req) => {
  try {
    const { name, email, password } = await req.json()

    // Check if all fields are provided
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      )
    }
    await dbConnect()


    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 400 }
      )
    }

    // Password hashing
    const hashedPassword = await bcrypt.hash(password, 10)

    await User.create({
      name,
      email,
      password: hashedPassword,
    })

    return NextResponse.json(
      { success: true, message: 'Account created successfully' },
      { status: 201 }
    )

  } catch (error) {
    console.log('Register error:', error)
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    )
  }
}