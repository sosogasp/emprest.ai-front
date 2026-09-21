import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/* Sessão via supabase-js com a anon key pública (ARQUITETURA.md).
   Dados NUNCA vêm do Supabase direto no navegador — apenas a sessão.
   Quando as variáveis não estiverem configuradas, o app roda em modo
   demonstração (Login oferece a entrada). */

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null
