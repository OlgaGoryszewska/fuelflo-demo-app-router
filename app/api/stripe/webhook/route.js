import Stripe from 'stripe';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

function getStripe() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY');
  }

  return new Stripe(stripeSecretKey, {
    apiVersion: '2023-11-15',
  });
}

export async function POST(request) {
  const signature = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return new Response(JSON.stringify({ error: 'Missing Stripe webhook configuration' }), {
      status: 400,
    });
  }

  const payload = await request.text();

  let event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    return new Response(JSON.stringify({ error: `Webhook signature verification failed: ${error.message}` }), {
      status: 400,
    });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const invoiceId = session.metadata?.invoice_id;

    if (!invoiceId) {
      return new Response(JSON.stringify({ error: 'Missing invoice ID in checkout session metadata' }), {
        status: 400,
      });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const amountPaid = session.amount_total ? Number(session.amount_total) / 100 : null;

    await supabaseAdmin.from('financial_transactions').update({
      amount_paid: amountPaid,
      status: 'paid',
      paid_at: new Date().toISOString(),
      stripe_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent,
      stripe_payment_status: session.payment_status,
      payment_method: session.payment_method_types?.[0] || 'card',
      payment_received_at: new Date().toISOString(),
    }).eq('id', invoiceId);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
