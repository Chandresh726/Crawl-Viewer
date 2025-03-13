export function parseUrl(url: string) {
  try {
    const { hostname, pathname, search } = new URL(url);
    return { domain: hostname, path: pathname, params: search };
  } catch {
    return { domain: '', path: '', params: '' };
  }
}
