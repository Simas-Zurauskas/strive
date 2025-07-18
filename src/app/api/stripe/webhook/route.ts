import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { addCreditsService } from '@/lib/services/creditService';
import mongoDb from '@/lib/mongo/db';
import CreditModel from '@/lib/mongo/models/CreditModel';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    if (!sig) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log('Webhook received - checkout.session.completed');
      console.log('Session metadata:', session.metadata);

      // Get metadata from the session
      const { userEmail, credits } = session.metadata || {};

      if (!userEmail || !credits) {
        console.error('Missing metadata in webhook:', session.metadata);
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
      }

      // Add credits to the user's account
      await mongoDb();
      const creditAmount = parseInt(credits);

      try {
        const credit = await CreditModel.findOne({ email: userEmail });
        if (credit) {
          const oldValue = credit.value;
          credit.value += creditAmount;
          await credit.save();
          console.log(
            `SUCCESS: Added ${creditAmount} credits to user ${userEmail}. Balance: ${oldValue} → ${credit.value}`,
          );
        } else {
          console.error(`Credit record not found for user ${userEmail}`);
          return NextResponse.json({ error: 'Credit record not found' }, { status: 400 });
        }
      } catch (error) {
        console.error('Error adding credits:', error);
        return NextResponse.json({ error: 'Failed to add credits' }, { status: 500 });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
