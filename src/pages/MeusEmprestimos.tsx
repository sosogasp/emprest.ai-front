import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/store/auth'
import { useToasts } from '@/store/toasts'
import { Modal } from '@/components/Modal'
import { Pill } from '@/components/Pill'
import { LIMITE_ITENS, emprestimosDe, type Emprestimo } from '@/data/emprestimos'
import { useDados, hoje } from '@/data/dados'
import { EstadoDados } from '@/components/EstadoDados'
import { estaAtrasado, formatarData } from '@/lib/format'

/** Meus empréstimos — layout.md §5.3, largura máxima 1000px. */
export default function MeusEmprestimos() {
  const usuario = useAuth((s) => s.usuario)!
  const { equipamentos, emprestimos, devolver, carregando, erro, refazer, salvando } = useDados()
  const hojeAtual = hoje()
  const mostrar = useToasts((s) => s.mostrar)
  const [emDevolucao, setEmDevolucao] = useState<Emprestimo | null>(null)

  const meus = emprestimosDe(usuario.id, emprestimos)

  const nomeDoItem = (id: string) => equipamentos.find((e) => e.id === id)?.nome ?? '—'
  const patrimonioDoItem = (id: string) =>
    equipamentos.find((e) => e.id === id)?.patrimonio ?? ''

  async function aoDevolver() {
    if (!emDevolucao || salvando) return
    try {
      await devolver(emDevolucao.id)
      setEmDevolucao(null)
      mostrar('Devolução registrada')
    } catch (error) { mostrar(error instanceof Error ? error.message : 'Não foi possível devolver') }
  }

  if (carregando || erro) return <EstadoDados carregando={carregando} erro={erro} refazer={refazer} />

  return (
    <main style={{ padding: '36px 40px 64px', maxWidth: 1000, margin: '0 auto', width: '100%' }}>
      <header className="page-head" style={{ alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Meus empréstimos</h1>
          <p className="page-lead">
            {meus.length} de {LIMITE_ITENS} itens em seu nome · prazo padrão de 14 dias
          </p>
        </div>
      </header>

      {/* Barra de 3 traços: ocupados no acento (atraso em vermelho), vazios em text 12% */}
      <div className="slots" style={{ marginTop: 22.4 }} aria-hidden="true">
        {Array.from({ length: LIMITE_ITENS }, (_, i) => {
          const emprestimo = meus[i]
          const atrasado = emprestimo && estaAtrasado(emprestimo.prazo, hojeAtual)
          return (
            <span
              key={i}
              className={`traco${emprestimo ? (atrasado ? ' traco-atraso' : ' traco-ocupado') : ''}`}
            />
          )
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 11.2, marginTop: 22.4 }}>
        {meus.length === 0 ? (
          <div className="empty">
            <p>Nenhum equipamento em seu nome.</p>
            <Link to="/" className="btn btn-primary">
              Ir ao catálogo
            </Link>
          </div>
        ) : (
          meus.map((l) => {
            const atrasado = estaAtrasado(l.prazo, hojeAtual)
            return (
              <article key={l.id} className="loan-row" style={{ borderLeftColor: atrasado ? 'var(--state-late-fg)' : 'var(--state-ok-bd)' }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{nomeDoItem(l.equipamentoId)}</p>
                  <p style={{ fontSize: 12, color: 'var(--t45)' }}>{patrimonioDoItem(l.equipamentoId)}</p>
                </div>
                <div>
                  <p style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--t45)' }}>Retirada</p>
                  <p style={{ fontSize: 13 }}>{formatarData(l.retirada)}</p>
                </div>
                <div>
                  <p style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--t45)' }}>Devolver até</p>
                  <p style={{ fontSize: 13, color: atrasado ? 'var(--state-late-fg)' : 'var(--state-ok-fg)' }}>
                    {formatarData(l.prazo)}
                  </p>
                </div>
                <Pill estado={atrasado ? 'atraso' : 'disponivel'} rotulo={atrasado ? 'Em atraso' : 'Em dia'} />
                <button type="button" className="btn btn-secondary" onClick={() => setEmDevolucao(l)}>
                  Devolver
                </button>
              </article>
            )
          })
        )}
      </div>

      {/* Rodapé de regras em três itens de 12.5px */}
      <footer
        style={{
          display: 'flex',
          gap: 22.4,
          marginTop: 33.6,
          paddingTop: 16.8,
          borderTop: '1px solid var(--color-divider)',
          fontSize: 12.5,
          color: 'var(--t45)',
        }}
      >
        <span>Máximo de {LIMITE_ITENS} itens ao mesmo tempo</span>
        <span>Prazo padrão de 14 dias</span>
        <span>Item em atraso bloqueia novo empréstimo</span>
      </footer>

      {emDevolucao && (
        <Modal
          titulo="Devolver equipamento"
          resumo={[
            { rotulo: 'Equipamento', valor: nomeDoItem(emDevolucao.equipamentoId) },
            { rotulo: 'Devolução em', valor: formatarData(hojeAtual) },
          ]}
          rotuloConfirmar="Confirmar devolução"
          onConfirmar={aoDevolver}
          onFechar={() => setEmDevolucao(null)}
        />
      )}
    </main>
  )
}
