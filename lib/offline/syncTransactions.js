import { supabase } from '@/lib/supabaseClient';
import {
  getOfflineTransactions,
  deleteOfflineTransaction,
} from '@/lib/offline/offlineDb';

async function uploadBeforePhoto(file, transactionId) {
  if (!file) return null;

  const fileExt = file.name?.split('.').pop() || 'jpg';
  const fileName = `before-${transactionId}-${Date.now()}.${fileExt}`;
  const filePath = `fuel-transactions/${transactionId}/${fileName}`;

  const { error } = await supabase.storage
    .from('fuel-transaction-photos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Photo upload error:', error);
    throw error;
  }

  const { data } = supabase.storage
    .from('fuel-transaction-photos')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function syncTransactions() {
  if (!navigator.onLine) return;

  console.log('Sync started');

  const items = await getOfflineTransactions();

  console.log('Offline transactions found:', items);

  for (const item of items) {
    try {
      console.log('Syncing item:', item.id);

      const beforePhotoUrl = await uploadBeforePhoto(
        item.before_photo_file,
        item.id
      );

      const { data, error } = await supabase
        .from('fuel_transactions')
        .insert([
          {
            id: item.id,
            type: item.type,
            project_id: item.project_id,
            generator_id: item.generator_id,
            tank_id: item.tank_id,
            technician_id: item.technician_id,
            completed_at: item.completed_at,
            before_fuel_level: item.before_fuel_level,
            before_photo_url: beforePhotoUrl,
            status: 'completed',
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        continue;
      }

      console.log('Synced successfully:', data);

      await deleteOfflineTransaction(item.id);
      console.log('Deleted from offline queue:', item.id);
    } catch (err) {
      console.error('Sync failed for item:', item.id, err);
    }
  }

  console.log('Sync finished');
}