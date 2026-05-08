export const ACTIVE_PROJECTS_CACHE_KEY = 'offline_active_projects';

const PROJECT_SELECT = 'id, name, location, start_date';

function readCachedProjects() {
  if (typeof localStorage === 'undefined') return null;

  const cachedProjects = localStorage.getItem(ACTIVE_PROJECTS_CACHE_KEY);
  if (!cachedProjects) return null;

  try {
    const parsedProjects = JSON.parse(cachedProjects);
    return Array.isArray(parsedProjects) ? parsedProjects : null;
  } catch {
    localStorage.removeItem(ACTIVE_PROJECTS_CACHE_KEY);
    return null;
  }
}

function writeCachedProjects(projects) {
  if (typeof localStorage === 'undefined') return;

  localStorage.setItem(
    ACTIVE_PROJECTS_CACHE_KEY,
    JSON.stringify(projects || [])
  );
}

export async function loadActiveProjectsWithCache(
  supabase,
  {
    offlineEmptyMessage = 'No projects saved offline yet. Open projects once with internet before going to the field.',
  } = {}
) {
  const cachedProjects = readCachedProjects();
  const isOnline =
    typeof navigator === 'undefined' ? true : Boolean(navigator.onLine);

  if (!isOnline) {
    if (cachedProjects) {
      return {
        projects: cachedProjects,
        isOfflineData: true,
        warning: '',
        error: '',
      };
    }

    return {
      projects: [],
      isOfflineData: false,
      warning: '',
      error: offlineEmptyMessage,
    };
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select(PROJECT_SELECT)
      .eq('active', true)
      .order('start_date', { ascending: false });

    if (error) throw error;

    writeCachedProjects(data || []);

    return {
      projects: data || [],
      isOfflineData: false,
      warning: '',
      error: '',
    };
  } catch (err) {
    if (cachedProjects) {
      return {
        projects: cachedProjects,
        isOfflineData: true,
        warning: 'Could not refresh projects. Showing saved offline data.',
        error: '',
      };
    }

    return {
      projects: [],
      isOfflineData: false,
      warning: '',
      error: err.message || 'Could not load projects.',
    };
  }
}
