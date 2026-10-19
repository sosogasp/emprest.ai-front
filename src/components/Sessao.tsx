import { useEffect, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { getPerfil } from '@/api/gerado'
import { useAuth } from '@/store/auth'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

/** Sincroniza o ciclo de vida da sessão antes de liberar as rotas. */
export function Sessao({ children }: { children: ReactNode }) {
  const inicializando = useAuth((s) => s.inicializando)
  const definirSessao = useAuth((s) => s.definirSessao)
  const queryClient = useQueryClient()
  const [erro, setErro] = useState<string | null>(null)
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    if (!supabase) {
      definirSessao(null)
      return
    }
    let ativo = true
    let revisao = 0
    const { data } = supabase.auth.onAuthStateChange((_evento, session) => {
      const atual = ++revisao
      if (!session) {
        queryClient.clear()
        definirSessao(null)
        setErro(null)
        return
      }
      // Sai do callback do provedor antes de ler a sessão no transporte HTTP.
      void Promise.resolve().then(async () => {
        try {
          const perfil = await getPerfil()
          if (ativo && atual === revisao) { definirSessao(perfil); setErro(null) }
        } catch (error) {
          if (ativo && atual === revisao) {
            definirSessao(null)
            setErro(error instanceof Error ? error.message : 'Não foi possível carregar seu perfil')
          }
        }
      })
    })
    return () => { ativo = false; data.subscription.unsubscribe() }
  }, [definirSessao, queryClient, tentativa])

  if (erro) return <main className="empty"><p role="alert">{erro}</p><button className="btn btn-primary" onClick={() => setTentativa((v) => v + 1)}>Tentar novamente</button><button className="btn btn-ghost" onClick={() => void supabase?.auth.signOut()}>Voltar ao login</button></main>

  if (inicializando) return <main role="status" className="empty">Carregando sessão…</main>
  return children
}
