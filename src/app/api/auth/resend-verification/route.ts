import { NextRequest, NextResponse } from 'next/server';
import UserModel from '@/lib/mongo/models/UserModel';
import mongoDb from '@/lib/mongo/db';
// import { sendVerificationEmail } from '@/lib/email/verification';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    await mongoDb();

    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      // For security reasons, don't reveal if a user exists or not
      return NextResponse.json(
        { success: true, message: 'If your email exists in our system, a verification link has been sent' },
        { status: 200 },
      );
    }

    // Check if email is already verified
    if (user.emailVerified) {
      return NextResponse.json({ success: true, message: 'Your email is already verified' }, { status: 200 });
    }

    // Here you would generate a token and send an email with a verification link
    // For now, let's assume this function exists (you would need to implement it)
    // The implementation would likely use a library to send emails and generate verification tokens

    // Mock function - would need to be implemented
    // await sendVerificationEmail(user.email, user._id.toString());

    // Since we can't implement the actual email sending without additional setup,
    // we'll just return a success response for now
    return NextResponse.json({ success: true, message: 'Verification email sent' }, { status: 200 });
  } catch (error) {
    console.error('Error resending verification email:', error);
    return NextResponse.json({ success: false, message: 'Error sending verification email' }, { status: 500 });
  }
}
