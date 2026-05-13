export async function getCurrentEvidenceLocation() {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return {
      location: null,
      error: 'Location is not available on this device.',
    };
  }

  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000,
      });
    });

    return {
      location: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy_meters: position.coords.accuracy,
        altitude: position.coords.altitude,
        altitude_accuracy_meters: position.coords.altitudeAccuracy,
        heading: position.coords.heading,
        speed: position.coords.speed,
        captured_at: new Date(position.timestamp).toISOString(),
      },
      error: '',
    };
  } catch (error) {
    return {
      location: null,
      error:
        error?.message ||
        'Location permission was denied or the position could not be captured.',
    };
  }
}

export async function getEvidencePermissionState() {
  if (typeof navigator === 'undefined' || !navigator.permissions?.query) {
    return 'unknown';
  }

  try {
    const permission = await navigator.permissions.query({
      name: 'geolocation',
    });

    return permission.state || 'unknown';
  } catch {
    return 'unknown';
  }
}

export async function getEvidenceCaptureContext() {
  const permissionState = await getEvidencePermissionState();
  const now = new Date();

  return {
    captured_at: now.toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    timezone_offset_minutes: now.getTimezoneOffset(),
    geolocation_permission_state: permissionState,
    secure_context: Boolean(globalThis.isSecureContext),
    online: typeof navigator === 'undefined' ? null : navigator.onLine,
    user_agent: typeof navigator === 'undefined' ? '' : navigator.userAgent,
    platform: typeof navigator === 'undefined' ? '' : navigator.platform,
    language: typeof navigator === 'undefined' ? '' : navigator.language,
    hardware_concurrency:
      typeof navigator === 'undefined' ? null : navigator.hardwareConcurrency,
    device_memory_gb:
      typeof navigator === 'undefined' ? null : navigator.deviceMemory || null,
    screen:
      typeof window === 'undefined'
        ? null
        : {
            width: window.screen?.width || null,
            height: window.screen?.height || null,
            pixel_ratio: window.devicePixelRatio || null,
          },
  };
}

export async function getFileSha256(file) {
  if (!file || typeof crypto === 'undefined' || !crypto.subtle) return '';

  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
}
