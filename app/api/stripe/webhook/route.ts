import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } else {
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === 'checkout.session.completed') {
    const subscriptionId = session.subscription as string;
    const customerId = session.customer as string;
    const userId = session.metadata?.userId;

    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: 'PRO',
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
        },
      });
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscriptionId = session.id as string;
    await prisma.user.updateMany({
      where: { stripeSubscriptionId: subscriptionId },
      data: {
        plan: 'FREE',
      },
    });
  }

  return NextResponse.json({ received: true });
}
