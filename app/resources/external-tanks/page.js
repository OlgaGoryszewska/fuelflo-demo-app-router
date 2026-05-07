import { createClient } from '@/lib/supabase/server';
import ExternalTanksResourceClient from '@/components/resources/ExternalTanksResourceClient';

export const dynamic = 'force-dynamic';

export default async function ExternalTanksPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('tanks')
    .select('*')
    .order('name', { ascending: true });

  return (
    <ExternalTanksResourceClient
      tanks={data || []}
      errorMessage={error?.message || ''}
    />
  );
}
