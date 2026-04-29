const GENERATORS_KEY = 'offline_generators';
const TANKS_KEY = 'offline_tanks';

export function saveGenerators(generators) {
  localStorage.setItem(GENERATORS_KEY, JSON.stringify(generators));
}

export function getGenerators() {
  const data = localStorage.getItem(GENERATORS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveTanks(tanks) {
  localStorage.setItem(TANKS_KEY, JSON.stringify(tanks));
}

export function getTanks() {
  const data = localStorage.getItem(TANKS_KEY);
  return data ? JSON.parse(data) : [];
}
