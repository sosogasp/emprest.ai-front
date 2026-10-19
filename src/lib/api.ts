import { supabase } from './supabase'

/** Transporte do cliente gerado: envia sessão e converte Problem Details. */
export async function requisicao<T>(url: string, options: RequestInit = {}): Promise<T> {
  const { data, error } = supabase ? await supabase.auth.getSession() : { data: { session: null }, error: null }
  if (error || !data.session) throw new Error('Sua sessão expirou. Entre novamente.')
  const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '')
  if (!base) throw new Error('Endereço da API não configurado')
  const headers = new Headers(options.headers)
  headers.set('Authorization', `Bearer ${data.session.access_token}`)
  headers.set('Content-Type', 'application/json')
  const response = await fetch(`${base}${url}`, { ...options, headers, signal: options.signal ?? AbortSignal.timeout(15000) })
  const body = await response.json()
  if (!response.ok) throw new Error(typeof body.detail === 'string' ? body.detail : 'Não foi possível concluir. Tente novamente.')
  return body
}
