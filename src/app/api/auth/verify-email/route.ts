import { NextRequest, NextResponse } from 'next/server';
import UserModel from '@/lib/mongo/models/UserModel';
import mongoDb from '@/lib/mongo/db';

// This would typically use a token passed in the URL
// For simplicity, we're just using the user's ID directly
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');
    const token = searchParams.get('token');

    if (!userId || !token) {
      return new Response('Invalid verification link', {
        status: 400,
      });
    }

    await mongoDb();

    // In a real implementation, you would validate the token
    // For now, we'll just update the user's emailVerified status
    const user = await UserModel.findById(userId);

    if (!user) {
      return new Response('User not found', {
        status: 404,
      });
    }

    // Update user's emailVerified status
    await UserModel.updateOne({ _id: userId }, { $set: { emailVerified: true } });

    // Redirect to home page or a success page
    return NextResponse.redirect(new URL('/?verificationSuccess=true', req.url));
  } catch (error) {
    console.error('Error verifying email:', error);
    return new Response('Error verifying email', {
      status: 500,
    });
  }
}
