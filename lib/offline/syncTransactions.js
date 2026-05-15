import { supabase } from '@/lib/supabaseClient';
import {
  addSyncLog,
  getOfflineTransactions,
  markOfflineTransactionError,
  markOfflineTransactionSynced,
  updateOfflineTransaction,
} from '@/lib/offline/offlineDb';

let activeSyncPromise = null;

async function uploadPhoto(file, transactionId, type) {
  if (!file) return null;

  const fileExt = file.name?.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${type}-${transactionId}.${fileExt}`;
  const filePath = `fuel-transactions/${transactionId}/${fileName}`;

  const { error } = await supabase.storage
    .from('fuel-transaction-photos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error(`${type} photo upload error:`, error);
    throw error;
  }

  const { data } = supabase.storage
    .from('fuel-transaction-photos')
    .getPublicUrl(filePath);

  return {
    filePath,
    publicUrl: data.publicUrl,
  };
}

function hasRequiredTransactionFields(item) {
  const hasBeforeFuelLevel =
    item.before_fuel_level !== null &&
    item.before_fuel_level !== undefined &&
    item.before_fuel_level !== '';
  const hasAfterFuelLevel =
    item.after_fuel_level !== null &&
    item.after_fuel_level !== undefined &&
    item.after_fuel_level !== '';
  const hasBeforeEvidence = Boolean(
    item.id &&
      item.type &&
      item.project_id &&
      item.generator_id &&
      item.tank_id &&
      item.technician_id &&
      hasBeforeFuelLevel &&
      (item.before_photo_url || item.before_photo_file)
  );

  if (!hasBeforeEvidence) return false;

  if (item.status !== 'completed') return true;

  return Boolean(
    hasAfterFuelLevel && (item.after_photo_url || item.after_photo_file)
  );
}

export async function syncTransactions() {
  if (typeof navigator === 'undefined') return;
  if (!navigator.onLine) return;
  if (activeSyncPromise) return activeSyncPromise;

  activeSyncPromise = runSyncTransactions().finally(() => {
    activeSyncPromise = null;
  });

  return activeSyncPromise;
}

async function runSyncTransactions() {
  console.log('Sync started');

  const items = await getOfflineTransactions();

  console.log('Offline transactions found:', items);

  for (const item of items) {
    try {
      console.log('Syncing item:', item.id);

      if (!hasRequiredTransactionFields(item)) {
        throw new Error(
          'Offline transaction is missing required before evidence.'
        );
      }

      let beforePhotoUrl = item.before_photo_url || null;
      let afterPhotoUrl = item.after_photo_url || null;

      if (!beforePhotoUrl && item.before_photo_file) {
        const upload = await uploadPhoto(
          item.before_photo_file,
          item.id,
          'before'
        );
        beforePhotoUrl = upload.publicUrl;

        await updateOfflineTransaction(item.id, {
          before_photo_url: beforePhotoUrl,
          before_photo_file: null,
          before_photo_path: upload.filePath,
          before_upload_status: 'uploaded',
          sync_status: 'pending',
        });
      }

      if (!afterPhotoUrl && item.after_photo_file) {
        const upload = await uploadPhoto(
          item.after_photo_file,
          item.id,
          'after'
        );
        afterPhotoUrl = upload.publicUrl;

        await updateOfflineTransaction(item.id, {
          after_photo_url: afterPhotoUrl,
          after_photo_file: null,
          after_photo_path: upload.filePath,
          after_upload_status: 'uploaded',
          sync_status: 'pending',
        });
      }

      const payload = {
        id: item.id,
        type: item.type,
        project_id: item.project_id,
        generator_id: item.generator_id,
        tank_id: item.tank_id,
        technician_id: item.technician_id,
        created_by: item.created_by || item.technician_id,
        completed_at: item.completed_at,
        before_fuel_level: item.before_fuel_level,
        before_photo_url: beforePhotoUrl,
        before_location: item.before_location || null,
        before_captured_at: item.before_captured_at || item.created_at || null,
        before_photo_sha256: item.before_photo_sha256 || null,
        before_capture_context: item.before_capture_context || null,
        operator_note: item.operator_note || null,
        after_fuel_level: item.after_fuel_level || null,
        after_photo_url: afterPhotoUrl,
        after_location: item.after_location || null,
        after_captured_at: item.after_captured_at || item.completed_at || null,
        after_photo_sha256: item.after_photo_sha256 || null,
        after_capture_context: item.after_capture_context || null,
        after_note: item.after_note || null,
        review_note: item.review_note || null,
        status: item.status || 'completed',
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
        throw error;
      }

      console.log('Synced successfully:', data);

      await markOfflineTransactionSynced(item.id, {
        ...payload,
        before_photo_file: null,
        after_photo_file: null,
        before_upload_status: beforePhotoUrl ? 'uploaded' : 'pending',
        after_upload_status: afterPhotoUrl ? 'uploaded' : 'pending',
        remote_saved_at: new Date().toISOString(),
      });
      await addSyncLog({
        transaction_id: item.id,
        status: 'synced',
      });
      console.log('Marked local transaction as synced:', item.id);
    } catch (err) {
      console.error('Sync failed for item:', item.id, err);
      await markOfflineTransactionError(item.id, err);
      await addSyncLog({
        transaction_id: item.id,
        status: 'error',
        message: err?.message || String(err),
      });
    }
  }

  console.log('Sync finished');
}
