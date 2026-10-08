-- Security hardening: trigger functions are not public RPC endpoints.
alter function public.set_updated_at() set search_path = '';
revoke execute on function public.bootstrap_profile() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
