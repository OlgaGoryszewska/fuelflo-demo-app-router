import Stripe from 'stripe';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

const ALLOWED_ROLES = new Set(['event_organizer', 'fuel_supplier']);

function getStripe() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY');
  }

  return new Stripe(stripeSecretKey, {
    apiVersion: '2023-11-15',
  });
}

function toCents(amount) {
  return Math.round(Number(amount) * 100);
}

function normalizeCurrency(currency) {
  if (!currency) return 'usd';
  return currency.toString().trim().toLowerCase();
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    const accessToken = authHeader.split(' ')[1];
    const body = await request.json();
    const transactionId = body?.transaction_id;

    if (!transactionId) {
      return new Response(JSON.stringify({ error: 'Missing transaction ID' }), {
        status: 400,
      });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(accessToken);

    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Invalid user session' }), {
        status: 401,
      });
    }

    const user = userData.user;
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: 'Unable to verify user role' }), {
        status: 403,
      });
    }

    if (!ALLOWED_ROLES.has(profile.role)) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
      });
    }

    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from('financial_transactions')
      .select(
        'id,invoice_number,amount_due,amount_paid,currency,contractor_id,contractor_role,contractor_email,status'
      )
      .eq('id', transactionId)
      .single();

    if (transactionError || !transaction) {
      return new Response(JSON.stringify({ error: 'Transaction not found' }), {
        status: 404,
      });
    }

    if (
      String(transaction.contractor_id) !== String(user.id) ||
      transaction.contractor_role !== profile.role
    ) {
      return new Response(JSON.stringify({ error: 'Invoice is not assigned to this profile' }), {
        status: 403,
      });
    }

    const amountDue = Number(transaction.amount_due || 0);
    const amountPaid = Number(transaction.amount_paid || 0);
    const outstandingAmount = Math.max(amountDue - amountPaid, 0);

    if (outstandingAmount <= 0) {
      return new Response(JSON.stringify({ error: 'Invoice is already paid' }), {
        status: 400,
      });
    }

    const origin = new URL(request.url).origin;
    const currency = normalizeCurrency(transaction.currency) || 'usd';
    const amountCents = toCents(outstandingAmount);
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: `FuelFlo invoice ${transaction.invoice_number || transaction.id}`,
              description: `Pay outstanding invoice for FuelFlo project`,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        invoice_id: transaction.id,
        user_id: user.id,
        role: profile.role,
      },
      customer_email: transaction.contractor_email || undefined,
      success_url: `${origin}/resources/payments/success?session_id={CHECKOUT_SESSION_ID}&invoice_id=${transaction.id}`,
      cancel_url: `${origin}/resources/payments/cancel?session_id={CHECKOUT_SESSION_ID}&invoice_id=${transaction.id}`,
    });

    await supabaseAdmin
      .from('financial_transactions')
      .update({ stripe_session_id: session.id, status: 'sent' })
      .eq('id', transaction.id);

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Server error' }), {
      status: 500,
    });
  }
}
