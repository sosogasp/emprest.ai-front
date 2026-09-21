import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useToasts } from '@/store/toasts'
import { Modal } from '@/components/Modal'
import { Pill } from '@/components/Pill'
import { Avatar } from '@/components/Avatar'
import { useDemo, HOJE_DEMO, PESSOAS, type Emprestimo } from '@/data/demo'
import { estaAtrasado, formatarData } from '@/lib/format'

/** Operações · empréstimos em aberto — layout.md §5.4, largura máxima 1320px. */
export default function Operacoes() {
  const { equipamentos, emprestimos, devolver } = useDemo()
  const mostrar = useToasts((s) => s.mostrar)
  const [busca, setBusca] = useState('')
  const [emDevolucao, setEmDevolucao] = useState<Emprestimo | null>(null)

  const item = (id: string) => equipamentos.find((e) => e.id === id)
  const pessoa = (id: string) => PESSOAS.find((p) => p.id === id)
  const emAtraso = (l: Emprestimo) => estaAtrasado(l.prazo, HOJE_DEMO)
  const disponiveis = equipamentos.filter(
    (e) => !e.manutencao && !emprestimos.some((l) => l.equipamentoId === e.id),
  ).length
  const manutencao = equipamentos.filter((e) => e.manutencao).length

  const termo = busca.trim().toLowerCase()
  const linhas = emprestimos.filter((l) => {
    if (!termo) return true
    // Operações filtra por pessoa + item (regra 8), case-insensitive
    const nomePessoa = pessoa(l.pessoaId)?.nome.toLowerCase() ?? ''
    const nomeItem = item(l.equipamentoId)?.nome.toLowerCase() ?? ''
    return nomePessoa.includes(termo) || nomeItem.includes(termo)
  })

  function aoDevolver() {
    if (!emDevolucao) return
    devolver(emDevolucao.id)
    setEmDevolucao(null)
    mostrar('Devolução registrada')
  }

  return (
    <main style={{ padding: '36px 40px 64px', maxWidth: 1320, margin: '0 auto', width: '100%' }}>
      <header className="page-head">
        <div>
          <h1 className="page-title">Operações</h1>
          <p className="page-lead">Empréstimos em aberto · registro de devolução no balcão</p>
        </div>
        <div style={{ display: 'flex', gap: 8.4 }}>
          <input
            type="search"
            className="input"
            style={{ width: 230 }}
            placeholder="Buscar por pessoa ou item"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            aria-label="Buscar empréstimo"
          />
          <Link to="/equipamentos" className="btn btn-primary">
            Cadastrar equipamento
          </Link>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 22.4 }}>
        <div className="card kpi">
          <span className="kpi-label">Em aberto</span>
          <span className="kpi-num">{emprestimos.length}</span>
          <span className="kpi-hint">fora do balcão agora</span>
        </div>
        <div className="card kpi">
          <span className="kpi-label">Em atraso</span>
          <span className="kpi-num kpi-num-late">{emprestimos.filter((l) => emAtraso(l)).length}</span>
          <span className="kpi-hint">prazo vencido</span>
        </div>
        <div className="card kpi">
          <span className="kpi-label">Disponíveis</span>
          <span className="kpi-num kpi-num-accent">{disponiveis}</span>
          <span className="kpi-hint">prontos para retirada</span>
        </div>
        <div className="card kpi">
          <span className="kpi-label">Manutenção</span>
          <span className="kpi-num kpi-num-off">{manutencao}</span>
          <span className="kpi-hint">indisponíveis</span>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16.8, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Pessoa</th>
              <th>Equipamento</th>
              <th>Patrimônio</th>
              <th>Retirada</th>
              <th>Prazo</th>
              <th>Situação</th>
              <th style={{ textAlign: 'right' }} aria-label="Ações" />
            </tr>
          </thead>
          <tbody>
            {linhas.map((l) => {
              const atrasado = emAtraso(l)
              return (
                <tr key={l.id}>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8.4 }}>
                      <Avatar iniciais={pessoa(l.pessoaId)?.iniciais ?? '??'} neutro pequeno />
                      {pessoa(l.pessoaId)?.nome ?? '—'}
                    </span>
                  </td>
                  <td>{item(l.equipamentoId)?.nome ?? '—'}</td>
                  <td style={{ color: 'var(--t45)' }}>{item(l.equipamentoId)?.patrimonio ?? '—'}</td>
                  <td>{formatarData(l.retirada)}</td>
                  <td style={{ color: atrasado ? 'var(--state-late-fg)' : 'var(--state-ok-fg)' }}>
                    {formatarData(l.prazo)}
                  </td>
                  <td>
                    <Pill estado={atrasado ? 'atraso' : 'emprestado'} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button type="button" className="btn btn-ghost" onClick={() => setEmDevolucao(l)}>
                      Registrar devolução
                    </button>
                  </td>
                </tr>
              )
            })}
            {linhas.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--t55)' }}>
                  Nenhum empréstimo em aberto para esta busca.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {emDevolucao && (
        <Modal
          titulo="Registrar devolução"
          resumo={[
            { rotulo: 'Pessoa', valor: pessoa(emDevolucao.pessoaId)?.nome ?? '—' },
            { rotulo: 'Equipamento', valor: item(emDevolucao.equipamentoId)?.nome ?? '—' },
          ]}
          rotuloConfirmar="Confirmar devolução"
          onConfirmar={aoDevolver}
          onFechar={() => setEmDevolucao(null)}
        />
      )}

    </main>
  )
}
