import { supabase } from '@/lib/supabaseClient';

export async function getCurrentProfileRole() {
  const savedRole =
    typeof window !== 'undefined'
      ? localStorage.getItem('offline_user_role')
      : null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return savedRole || '';

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error) return savedRole || '';

  if (profile?.role && typeof window !== 'undefined') {
    localStorage.setItem('offline_user_role', profile.role);
  }

  return profile?.role || savedRole || '';
}
