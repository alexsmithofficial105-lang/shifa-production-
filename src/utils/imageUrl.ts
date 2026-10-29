export function getCleanImageUrl(path?: string): string {
  if (!path) return '/images/hero_cinematic_production_1793180767552.jpg';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  // Convert legacy /src/assets/images/ to /images/ for static builds
  if (path.startsWith('/src/assets/images/')) {
    return path.replace('/src/assets/images/', '/images/');
  }
  return path;
}
