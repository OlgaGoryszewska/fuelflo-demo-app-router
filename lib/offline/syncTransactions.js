import { supabase } from '@/lib/supabaseClient';
import {
  getOfflineTransactions,
  deleteOfflineTransaction,
} from '@/lib/offline/offlineDb';

async function uploadPhoto(file, transactionId, type) {
  if (!file) return null;

  const fileExt = file.name?.split('.').pop() || 'jpg';
  const fileName = `${type}-${transactionId}-${Date.now()}.${fileExt}`;
  const filePath = `fuel-transactions/${transactionId}/${fileName}`;

  const { error } = await supabase.storage
    .from('fuel-transaction-photos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error(`${type} photo upload error:`, error);
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

      const beforePhotoUrl = await uploadPhoto(
        item.before_photo_file,
        item.id,
        'before'
      );

      const afterPhotoUrl = await uploadPhoto(
        item.after_photo_file,
        item.id,
        'after'
      );

      const payload = {
        id: item.id,
        type: item.type,
        project_id: item.project_id,
        generator_id: item.generator_id,
        tank_id: item.tank_id,
        technician_id: item.technician_id,
        completed_at: item.completed_at,
        before_fuel_level: item.before_fuel_level,
        before_photo_url: beforePhotoUrl || item.before_photo_url || null,
        after_fuel_level: item.after_fuel_level || null,
        after_photo_url: afterPhotoUrl || item.after_photo_url || null,
        status: 'completed',
      };

      const { data, error } = await supabase
        .from('fuel_transactions')
        .upsert(payload, {
          onConflict: 'id',
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase sync error:', error);
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
