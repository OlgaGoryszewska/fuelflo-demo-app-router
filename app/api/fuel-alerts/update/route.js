import { getSupabaseAdmin } from '@/lib/supabase/admin';

const ALLOWED_STATUSES = new Set(['open', 'acknowledged', 'resolved', 'dismissed']);
const ALLOWED_ROLES = new Set([
  'hire_desk',
  'manager',
  'technician',
  'fuel_supplier',
]);

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

async function authorize(request, supabaseAdmin) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return { error: json({ error: 'Unauthorized' }, 401) };
  }

  const accessToken = authHeader.split(' ')[1];
  const { data: userData, error: userError } =
    await supabaseAdmin.auth.getUser(accessToken);

  if (userError || !userData?.user) {
    return { error: json({ error: 'Invalid user session' }, 401) };
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id, role')
    .eq('id', userData.user.id)
    .maybeSingle();

  if (profileError || !profile || !ALLOWED_ROLES.has(profile.role)) {
    return { error: json({ error: 'Forbidden' }, 403) };
  }

  return { user: userData.user, profile };
}

export async function PATCH(request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const auth = await authorize(request, supabaseAdmin);
    if (auth.error) return auth.error;

    const body = await request.json();
    const alertId = body?.id;
    const status = body?.status;

    if (!alertId || !ALLOWED_STATUSES.has(status)) {
      return json({ error: 'Alert id and valid status are required.' }, 400);
    }

    const reviewFields =
      status === 'open'
        ? { reviewed_by: null, reviewed_at: null }
        : { reviewed_by: auth.user.id, reviewed_at: new Date().toISOString() };

    const { data, error } = await supabaseAdmin
      .from('fuel_alerts')
      .update({
        status,
        ...reviewFields,
      })
      .eq('id', alertId)
      .select('*')
      .single();

    if (error) throw error;

    return json({ message: 'Fuel alert updated.', alert: data });
  } catch (error) {
    return json({ error: error.message || 'Could not update fuel alert.' }, 500);
  }
}
