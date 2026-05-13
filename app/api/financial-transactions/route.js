import { getSupabaseAdmin } from '@/lib/supabase/admin';

const CONTRACTOR_ROLES = new Set(['event_organizer', 'fuel_supplier']);

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

    const {
      project_id,
      invoice_number,
      contractor_id,
      amount_due,
      currency,
      due_date,
      notes,
    } = body;

    if (!invoice_number || !amount_due || !contractor_id) {
      return new Response(
        JSON.stringify({ error: 'Invoice number, amount, and contractor are required.' }),
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(
      accessToken
    );

    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Invalid user session' }), {
        status: 401,
      });
    }

    const user = userData.user;

    const { data: contractor, error: contractorError } = await supabaseAdmin
      .from('profiles')
      .select('id, role, full_name, email')
      .eq('id', contractor_id)
      .single();

    if (contractorError || !contractor) {
      return new Response(JSON.stringify({ error: 'Selected contractor profile was not found.' }), {
        status: 400,
      });
    }

    if (!CONTRACTOR_ROLES.has(contractor.role)) {
      return new Response(
        JSON.stringify({ error: 'Fakturas can only be assigned to event organizers or fuel suppliers.' }),
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin.from('financial_transactions').insert({
      project_id: project_id || null,
      invoice_number: invoice_number.trim(),
      type: 'invoice',
      status: 'draft',
      contractor_id: contractor.id,
      contractor_role: contractor.role,
      contractor_name: contractor.full_name || null,
      contractor_email: contractor.email || null,
      amount_due: Number(amount_due) || 0,
      amount_paid: 0,
      currency: currency || 'SAR',
      due_date: due_date || null,
      notes: notes || null,
      created_by: user.id,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      });
    }

    return new Response(
      JSON.stringify({ message: 'Faktura created successfully.', data }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Server error.' }),
      { status: 500 }
    );
  }
}
