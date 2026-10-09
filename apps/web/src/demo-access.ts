/** Demo is UI-only. Never use it to authorize a request to /api or Supabase. */
export function canUseLocalDemo(dev: boolean, hostname: string): boolean {
  return dev && (hostname === 'localhost' || hostname === '127.0.0.1');
}
