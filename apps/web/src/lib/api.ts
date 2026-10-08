import {createClient} from '@supabase/supabase-js';
export const supabase=createClient(import.meta.env.VITE_SUPABASE_URL||'https://invalid.example',import.meta.env.VITE_SUPABASE_ANON_KEY||'missing');
const base=import.meta.env.VITE_API_URL||'http://localhost:3001';
export async function api<T>(path:string,options:RequestInit={}):Promise<T>{const {data}=await supabase.auth.getSession();if(!data.session)throw new Error('Faça login novamente');const response=await fetch(base+'/api'+path,{...options,headers:{'Content-Type':'application/json',Authorization:'Bearer '+data.session.access_token,...options.headers}});const json=await response.json();if(!response.ok)throw new Error(json.error||'Falha na requisição');return json as T}
