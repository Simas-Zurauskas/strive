import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import UserModel from '@/lib/mongo/models/UserModel';
import CreditModel from '@/lib/mongo/models/CreditModel';
import mongoDb from '@/lib/mongo/db';
import { genUxId } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    await mongoDb();

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'User with this email already exists' }, { status: 409 });
    }

    // Check if credit already exists
    const existingCredit = await CreditModel.findOne({ email });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with required image field
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      emailVerified: false,
      verificationSecretToken: genUxId(),
    });

    // Create credits for the new user only if not exists already
    if (!existingCredit) {
      await CreditModel.create({
        email,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, message: 'Error creating user' }, { status: 500 });
  }
}
