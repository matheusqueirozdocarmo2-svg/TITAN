import 'dotenv/config';
import {createClient} from '@supabase/supabase-js';
const url=process.env.SUPABASE_URL;const anon=process.env.SUPABASE_ANON_KEY;const service=process.env.SUPABASE_SERVICE_ROLE_KEY;
export function adminDb(){if(!url||!service)throw new Error('SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY não configuradas');return createClient(url,service,{auth:{persistSession:false}})}
export async function verifyToken(token:string){if(!url||!anon)throw new Error('Supabase não configurado');const auth=createClient(url,anon,{auth:{persistSession:false}});const {data,error}=await auth.auth.getUser(token);if(error||!data.user)throw new Error('Sessão inválida');return data.user}
