import { createClient } from '@/lib/supabase/server';
import GeneratorsResourceClient from '@/components/resources/GeneratorsResourceClient';

export const dynamic = 'force-dynamic';

export default async function GeneratorsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('generators')
    .select('*')
    .order('name', { ascending: true });

  return (
    <GeneratorsResourceClient
      generators={data || []}
      errorMessage={error?.message || ''}
    />
  );
}
