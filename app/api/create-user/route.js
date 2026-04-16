import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request) {
  try {
    const body = await request.json();
    const { full_name, email, password, role, address, phone } = body;

    if (!full_name || !email || !password || !role) {
      return Response.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      );
    }

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
      return Response.json(
        { error: 'User was not created.' },
        { status: 400 }
      );
    }

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: user.id,
        full_name,
        email,
        phone: phone || null,
        role,
        address: address || null,
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