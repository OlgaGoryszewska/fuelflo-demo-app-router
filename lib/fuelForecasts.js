export const FUEL_ALERT_THRESHOLDS = {
  critical: 6,
  urgent: 24,
  warning: 48,
};

export const DEFAULT_GENERATOR_LOAD_FACTOR = 0.75;

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function addHours(date, hours) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

export function getFuelAlertRiskLevel(hoursUntilEmpty) {
  if (hoursUntilEmpty === null || hoursUntilEmpty === undefined) return 'unknown';
  if (hoursUntilEmpty <= FUEL_ALERT_THRESHOLDS.critical) return 'critical';
  if (hoursUntilEmpty <= FUEL_ALERT_THRESHOLDS.urgent) return 'urgent';
  if (hoursUntilEmpty <= FUEL_ALERT_THRESHOLDS.warning) return 'warning';

  return 'ok';
}

export function getForecastSourceLevel(transaction) {
  if (!transaction) return null;

  const afterLevel = toNumber(transaction.after_fuel_level);
  if (afterLevel !== null) return afterLevel;

  return toNumber(transaction.before_fuel_level);
}

export function estimateGeneratorBurnRate(generator, loadFactor = DEFAULT_GENERATOR_LOAD_FACTOR) {
  const consumptionAtFullLoad = toNumber(generator?.fuel_consumption_100);
  if (consumptionAtFullLoad !== null && consumptionAtFullLoad > 0) {
    return consumptionAtFullLoad * loadFactor;
  }

  const capacity = toNumber(generator?.fuel_capacity);
  const runtimeAtFullLoad = toNumber(generator?.run_hours_100_load);
  if (capacity !== null && runtimeAtFullLoad !== null && runtimeAtFullLoad > 0) {
    return (capacity / runtimeAtFullLoad) * loadFactor;
  }

  return null;
}

export function buildGeneratorForecast({
  generator,
  project,
  latestTransaction,
  now = new Date(),
  loadFactor = DEFAULT_GENERATOR_LOAD_FACTOR,
}) {
  const currentLiters = getForecastSourceLevel(latestTransaction);
  const burnRate = estimateGeneratorBurnRate(generator, loadFactor);
  const capacityLiters = toNumber(generator?.fuel_capacity);

  if (currentLiters === null || burnRate === null || burnRate <= 0) {
    return {
      asset_type: 'generator',
      asset_id: generator?.id || null,
      asset_name: generator?.name || generator?.generator_name || 'Unnamed generator',
      project_id: project?.id || latestTransaction?.project_id || null,
      project_name: project?.name || 'Unassigned project',
      current_liters: currentLiters,
      capacity_liters: capacityLiters,
      consumption_liters_per_hour: burnRate,
      hours_until_empty: null,
      estimated_empty_at: null,
      risk_level: 'unknown',
      source_transaction_id: latestTransaction?.id || null,
      reason: 'Missing current fuel reading or generator consumption data.',
    };
  }

  const hoursUntilEmpty = currentLiters / burnRate;
  const riskLevel = getFuelAlertRiskLevel(hoursUntilEmpty);

  return {
    asset_type: 'generator',
    asset_id: generator?.id || null,
    asset_name: generator?.name || generator?.generator_name || 'Unnamed generator',
    project_id: project?.id || latestTransaction?.project_id || null,
    project_name: project?.name || 'Unassigned project',
    current_liters: currentLiters,
    capacity_liters: capacityLiters,
    consumption_liters_per_hour: burnRate,
    hours_until_empty: hoursUntilEmpty,
    estimated_empty_at: addHours(now, hoursUntilEmpty).toISOString(),
    risk_level: riskLevel,
    source_transaction_id: latestTransaction?.id || null,
    reason:
      riskLevel === 'ok'
        ? 'Generator fuel level is outside alert thresholds.'
        : `Generator is forecast to be empty in ${hoursUntilEmpty.toFixed(1)} hours.`,
  };
}

export function buildTankForecast({ tank, project, latestTransaction, now = new Date() }) {
  const currentLiters = getForecastSourceLevel(latestTransaction);
  const capacityLiters = toNumber(tank?.capacity_liters);

  if (currentLiters === null) {
    return {
      asset_type: 'tank',
      asset_id: tank?.id || null,
      asset_name: tank?.name || tank?.tank_name || 'Unnamed tank',
      project_id: project?.id || latestTransaction?.project_id || null,
      project_name: project?.name || 'Unassigned project',
      current_liters: null,
      capacity_liters: capacityLiters,
      consumption_liters_per_hour: null,
      hours_until_empty: null,
      estimated_empty_at: null,
      risk_level: 'unknown',
      source_transaction_id: latestTransaction?.id || null,
      reason: 'Missing current tank reading.',
    };
  }

  const reserveLiters = capacityLiters ? capacityLiters * 0.1 : 100;
  const percentRemaining =
    capacityLiters && capacityLiters > 0 ? (currentLiters / capacityLiters) * 100 : null;
  const riskLevel =
    currentLiters <= reserveLiters
      ? 'critical'
      : percentRemaining !== null && percentRemaining <= 20
        ? 'urgent'
        : percentRemaining !== null && percentRemaining <= 35
          ? 'warning'
          : 'ok';

  return {
    asset_type: 'tank',
    asset_id: tank?.id || null,
    asset_name: tank?.name || tank?.tank_name || 'Unnamed tank',
    project_id: project?.id || latestTransaction?.project_id || null,
    project_name: project?.name || 'Unassigned project',
    current_liters: currentLiters,
    capacity_liters: capacityLiters,
    consumption_liters_per_hour: null,
    hours_until_empty: riskLevel === 'critical' ? 0 : null,
    estimated_empty_at: riskLevel === 'critical' ? now.toISOString() : null,
    risk_level: riskLevel,
    source_transaction_id: latestTransaction?.id || null,
    reason:
      riskLevel === 'ok'
        ? 'Tank fuel level is outside alert thresholds.'
        : `Tank is at ${percentRemaining === null ? `${currentLiters} L` : `${percentRemaining.toFixed(0)}%`} remaining.`,
  };
}

export function shouldCreateFuelAlert(forecast) {
  return ['critical', 'urgent', 'warning', 'unknown'].includes(forecast?.risk_level);
}

export function makeFuelAlertKey(forecast) {
  return [
    forecast.asset_type,
    forecast.project_id || 'no-project',
    forecast.asset_id || forecast.asset_name || 'no-asset',
  ].join(':');
}
