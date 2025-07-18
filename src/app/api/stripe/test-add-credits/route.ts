import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { addCreditsService } from '@/lib/services/creditService';
import mongoDb from '@/lib/mongo/db';
import ProcessedSessionModel from '@/lib/mongo/models/ProcessedSessionModel';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { credits, sessionId } = await req.json();

    if (!credits || typeof credits !== 'number') {
      return NextResponse.json({ error: 'Invalid credits amount' }, { status: 400 });
    }

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    await mongoDb();

    // Check if this session has already been processed
    const existingSession = await ProcessedSessionModel.findOne({ sessionId });
    if (existingSession) {
      return NextResponse.json(
        {
          success: false,
          message: 'Credits already added for this session',
        },
        { status: 409 },
      );
    }

    // Add credits to user account
    await addCreditsService(credits);

    // Mark session as processed
    await ProcessedSessionModel.create({
      sessionId,
      userEmail: user.email,
      credits,
      processed: true,
    });

    return NextResponse.json({
      success: true,
      message: `Added ${credits} credits to ${user.email}`,
    });
  } catch (error) {
    console.error('Test add credits error:', error);
    return NextResponse.json({ error: 'Failed to add credits' }, { status: 500 });
  }
}
