export function resolveImageUrl(url) {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  const base = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
  if (url.startsWith('/')) return `${base}${url}`;
  return `${base}/${url}`;
}
