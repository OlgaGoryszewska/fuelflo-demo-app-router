import { getSupabaseAdmin } from '@/lib/supabase/admin';

const ALLOWED_ROLES = new Set([
  'technician',
  'manager',
  'hire_desk',
  'event_organizer',
  'fuel_supplier',
]);

function trimValue(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export async function POST(request) {
  try {
    const body = await request.json();
    const full_name = trimValue(body.full_name);
    const email = trimValue(body.email).toLowerCase();
    const password = body.password || '';
    const role = trimValue(body.role);
    const address = trimValue(body.address);
    const phone = trimValue(body.phone);

    if (!full_name || !email || !password || !role || !address || !phone) {
      return Response.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { error: 'Enter a valid email address.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return Response.json(
        { error: 'Password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_ROLES.has(role)) {
      return Response.json({ error: 'Invalid user role.' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) {
      return Response.json({ error: authError.message }, { status: 400 });
    }

    const user = authData.user;

    if (!user) {
      return Response.json({ error: 'User was not created.' }, { status: 400 });
    }

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: user.id,
        full_name,
        email,
        phone,
        role,
        address,
      });

    if (profileError) {
      return Response.json({ error: profileError.message }, { status: 400 });
    }

    return Response.json(
      {
        message: 'User and profile created successfully.',
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { error: error.message || 'Server error.' },
      { status: 500 }
    );
  }
}
