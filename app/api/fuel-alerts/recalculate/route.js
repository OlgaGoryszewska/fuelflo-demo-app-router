import { getSupabaseAdmin } from '@/lib/supabase/admin';
import {
  buildGeneratorForecast,
  buildTankForecast,
  makeFuelAlertKey,
  shouldCreateFuelAlert,
} from '@/lib/fuelForecasts';

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

function uniqueValues(values) {
  return Array.from(new Set(values.filter(Boolean).map(String)));
}

function byId(rows) {
  return new Map((rows || []).map((row) => [String(row.id), row]));
}

function latestTransactionFor(transactions, field, id, projectId) {
  if (!id) return null;

  return (
    transactions.find(
      (transaction) =>
        String(transaction[field] || '') === String(id) &&
        String(transaction.project_id || '') === String(projectId)
    ) || null
  );
}

function formatHours(hours) {
  if (hours === null || hours === undefined) return 'unknown';
  if (hours < 1) return `${Math.max(Math.round(hours * 60), 0)} min`;

  return `${hours.toFixed(1)} h`;
}

function buildAlertPayload(forecast) {
  const alertKey = makeFuelAlertKey(forecast);
  const isGenerator = forecast.asset_type === 'generator';
  const hoursText = formatHours(forecast.hours_until_empty);

  return {
    alert_key: alertKey,
    project_id: forecast.project_id,
    project_name: forecast.project_name,
    asset_type: forecast.asset_type,
    asset_id: forecast.asset_id ? String(forecast.asset_id) : null,
    asset_name: forecast.asset_name,
    risk_level: forecast.risk_level,
    status: 'open',
    title:
      forecast.risk_level === 'unknown'
        ? `${forecast.asset_name} needs fuel forecast data`
        : `${forecast.asset_name} fuel ${forecast.risk_level}`,
    description: isGenerator
      ? `${forecast.project_name}: estimated empty in ${hoursText}. ${forecast.reason}`
      : `${forecast.project_name}: ${forecast.reason}`,
    current_liters: forecast.current_liters,
    capacity_liters: forecast.capacity_liters,
    consumption_liters_per_hour: forecast.consumption_liters_per_hour,
    hours_until_empty: forecast.hours_until_empty,
    estimated_empty_at: forecast.estimated_empty_at,
    source_transaction_id: forecast.source_transaction_id,
    reviewed_by: null,
    reviewed_at: null,
  };
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

async function fetchRows(supabaseAdmin) {
  const { data: projects, error: projectsError } = await supabaseAdmin
    .from('projects')
    .select('id, name, manager_id, active')
    .eq('active', true);

  if (projectsError) throw projectsError;

  const projectIds = uniqueValues((projects || []).map((project) => project.id));
  if (projectIds.length === 0) {
    return {
      projects: [],
      fleetRows: [],
      generators: [],
      tanks: [],
      transactions: [],
    };
  }

  const { data: fleetRows, error: fleetError } = await supabaseAdmin
    .from('generators_tanks')
    .select('id, project_id, generator_id, generator_name, tank_id, tank_name')
    .in('project_id', projectIds);

  if (fleetError) throw fleetError;

  const generatorIds = uniqueValues((fleetRows || []).map((row) => row.generator_id));
  const tankIds = uniqueValues((fleetRows || []).map((row) => row.tank_id));

  const [generatorResult, tankResult, transactionResult] = await Promise.all([
    generatorIds.length > 0
      ? supabaseAdmin
          .from('generators')
          .select('id, name, fuel_capacity, fuel_consumption_100, run_hours_100_load')
          .in('id', generatorIds)
      : Promise.resolve({ data: [], error: null }),
    tankIds.length > 0
      ? supabaseAdmin
          .from('tanks')
          .select('id, name, capacity_liters')
          .in('id', tankIds)
      : Promise.resolve({ data: [], error: null }),
    supabaseAdmin
      .from('fuel_transactions')
      .select(
        'id, type, status, created_at, completed_at, project_id, generator_id, tank_id, before_fuel_level, after_fuel_level, after_photo_url'
      )
      .in('project_id', projectIds)
      .order('created_at', { ascending: false })
      .limit(1000),
  ]);

  const firstError = generatorResult.error || tankResult.error || transactionResult.error;
  if (firstError) throw firstError;

  return {
    projects: projects || [],
    fleetRows: fleetRows || [],
    generators: generatorResult.data || [],
    tanks: tankResult.data || [],
    transactions: transactionResult.data || [],
  };
}

export async function POST(request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const auth = await authorize(request, supabaseAdmin);
    if (auth.error) return auth.error;

    const { projects, fleetRows, generators, tanks, transactions } =
      await fetchRows(supabaseAdmin);

    const projectsById = byId(projects);
    const generatorsById = byId(generators);
    const tanksById = byId(tanks);
    const now = new Date();
    const forecasts = [];
    const seenGeneratorKeys = new Set();
    const seenTankKeys = new Set();

    for (const row of fleetRows) {
      const project = projectsById.get(String(row.project_id));
      if (!project) continue;

      if (row.generator_id) {
        const key = `${row.project_id}:${row.generator_id}`;

        if (!seenGeneratorKeys.has(key)) {
          seenGeneratorKeys.add(key);
          const generator = {
            ...(generatorsById.get(String(row.generator_id)) || {}),
            id: row.generator_id,
            name:
              generatorsById.get(String(row.generator_id))?.name ||
              row.generator_name,
          };

          forecasts.push(
            buildGeneratorForecast({
              generator,
              project,
              latestTransaction: latestTransactionFor(
                transactions,
                'generator_id',
                row.generator_id,
                row.project_id
              ),
              now,
            })
          );
        }
      }

      if (row.tank_id) {
        const key = `${row.project_id}:${row.tank_id}`;

        if (!seenTankKeys.has(key)) {
          seenTankKeys.add(key);
          const tank = {
            ...(tanksById.get(String(row.tank_id)) || {}),
            id: row.tank_id,
            name: tanksById.get(String(row.tank_id))?.name || row.tank_name,
          };

          forecasts.push(
            buildTankForecast({
              tank,
              project,
              latestTransaction: latestTransactionFor(
                transactions,
                'tank_id',
                row.tank_id,
                row.project_id
              ),
              now,
            })
          );
        }
      }
    }

    const alertPayloads = forecasts
      .filter(shouldCreateFuelAlert)
      .map(buildAlertPayload);

    if (alertPayloads.length > 0) {
      const { error: upsertError } = await supabaseAdmin
        .from('fuel_alerts')
        .upsert(alertPayloads, { onConflict: 'alert_key' });

      if (upsertError) throw upsertError;
    }

    const activeKeys = new Set(alertPayloads.map((alert) => alert.alert_key));
    const { data: openAlerts, error: openError } = await supabaseAdmin
      .from('fuel_alerts')
      .select('id, alert_key')
      .eq('status', 'open');

    if (openError) throw openError;

    const staleAlerts = (openAlerts || []).filter(
      (alert) => !activeKeys.has(alert.alert_key)
    );

    await Promise.all(
      staleAlerts.map((alert) =>
        supabaseAdmin
          .from('fuel_alerts')
          .update({ status: 'resolved', reviewed_by: auth.user.id, reviewed_at: now.toISOString() })
          .eq('id', alert.id)
      )
    );

    return json({
      message: 'Fuel alerts recalculated.',
      forecasts: forecasts.length,
      open_alerts: alertPayloads.length,
      resolved_alerts: staleAlerts.length,
    });
  } catch (error) {
    return json({ error: error.message || 'Could not recalculate fuel alerts.' }, 500);
  }
}
