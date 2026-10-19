import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/store/auth'
import { useToasts } from '@/store/toasts'
import { Modal } from '@/components/Modal'
import { Pill } from '@/components/Pill'
import {
  PRAZO_PADRAO_DIAS,
  LIMITE_ITENS,
  situacaoDoEquipamento,
  emprestimoDoItem,
  emprestimosDe,
  temAtraso,
  type Equipamento,
  type Situacao,
} from '@/data/emprestimos'
import { useDados, hoje } from '@/data/dados'
import { EstadoDados } from '@/components/EstadoDados'
import { formatarData, somarDias } from '@/lib/format'

type Filtro = 'todos' | 'disponivel' | 'emprestado' | 'manutencao'

const FILTROS: { chave: Filtro; rotulo: string }[] = [
  { chave: 'todos', rotulo: 'Todos' },
  { chave: 'disponivel', rotulo: 'Disponíveis' },
  { chave: 'emprestado', rotulo: 'Emprestados' },
  { chave: 'manutencao', rotulo: 'Em manutenção' },
]

/** Catálogo — layout.md §5.2, largura máxima 1240px. */
export default function Catalogo() {
  const usuario = useAuth((s) => s.usuario)!
  const { equipamentos, emprestimos, ativos, pessoas, solicitar, carregando, erro, refazer, salvando } = useDados()
  const hojeAtual = hoje()
  const mostrar = useToasts((s) => s.mostrar)
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [paraSolicitar, setParaSolicitar] = useState<Equipamento | null>(null)

  const meus = emprestimosDe(usuario.id, emprestimos)
  const bloqueadoPorAtraso = temAtraso(usuario.id, emprestimos, hojeAtual)
  const noLimite = meus.length >= LIMITE_ITENS

  const situacao = (item: Equipamento): Situacao => situacaoDoEquipamento(item, ativos)
  const disponiveis = equipamentos.filter((e) => situacao(e) === 'disponivel').length

  const termo = busca.trim().toLowerCase()
  const visiveis = equipamentos.filter((item) => {
    const sit = situacao(item)
    if (filtro !== 'todos' && sit !== filtro) return false
    if (!termo) return true
    // busca por nome + patrimônio, case-insensitive (regra 8)
    return item.nome.toLowerCase().includes(termo) || item.patrimonio.toLowerCase().includes(termo)
  })

  function estadoDoBotao(item: Equipamento): {
    rotulo: string
    desabilitado: boolean
    classe: string
  } {
    const sit = situacao(item)
    if (sit === 'manutencao')
      return { rotulo: 'Indisponível', desabilitado: true, classe: 'btn-secondary' }
    const emprestimo = emprestimoDoItem(item, ativos)
    if (emprestimo) {
      if (emprestimo.pessoaId === usuario.id)
        return { rotulo: 'Está com você', desabilitado: true, classe: 'btn-secondary' }
      return { rotulo: 'Emprestado', desabilitado: true, classe: 'btn-secondary' }
    }
    if (bloqueadoPorAtraso)
      return { rotulo: 'Bloqueado por atraso', desabilitado: true, classe: 'btn-secondary' }
    if (noLimite)
      return { rotulo: `Limite de ${LIMITE_ITENS} itens`, desabilitado: true, classe: 'btn-secondary' }
    return { rotulo: 'Solicitar empréstimo', desabilitado: false, classe: 'btn-primary' }
  }

  function linhaDetalhe(item: Equipamento): string {
    const sit = situacao(item)
    if (sit === 'manutencao') return item.observacao ?? 'Em manutenção'
    const emprestimo = emprestimoDoItem(item, ativos)
    if (!emprestimo) return 'Pronto para retirada no balcão'
    if (emprestimo.pessoaId === usuario.id)
      return `Com você · devolver até ${formatarData(emprestimo.prazo)}`
    const pessoa = pessoas.find((p) => p.id === emprestimo.pessoaId)
    return `Com ${pessoa?.nome ?? 'outra pessoa'} · devolver até ${formatarData(emprestimo.prazo)}`
  }

  async function confirmarSolicitacao() {
    if (!paraSolicitar || salvando) return
    try {
      await solicitar(paraSolicitar.id)
      setParaSolicitar(null)
      mostrar('Empréstimo registrado')
    } catch (error) { mostrar(error instanceof Error ? error.message : 'Não foi possível registrar') }
  }

  if (carregando || erro) return <EstadoDados carregando={carregando} erro={erro} refazer={refazer} />

  return (
    <main style={{ padding: '36px 40px 64px', maxWidth: 1240, margin: '0 auto', width: '100%' }}>
      <header className="page-head">
        <div>
          <h1 className="page-title">Catálogo</h1>
          <p className="page-lead">
            {disponiveis} de {equipamentos.length} equipamentos disponíveis agora
          </p>
        </div>
        <input
          type="search"
          className="input"
          style={{ width: 260 }}
          placeholder="Buscar por nome ou patrimônio"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          aria-label="Buscar equipamento"
        />
      </header>

      {bloqueadoPorAtraso && (
        <div className="banner" style={{ marginTop: 22.4 }}>
          <span>Você tem um item em atraso — devolva antes de pedir outro.</span>
          <Link to="/meus" className="btn btn-ghost" style={{ marginLeft: 'auto' }}>
            Ver meu empréstimo em atraso →
          </Link>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8.4, marginTop: 22.4 }}>
        {FILTROS.map((f) => (
          <button
            key={f.chave}
            type="button"
            className={`chip${filtro === f.chave ? ' active' : ''}`}
            onClick={() => setFiltro(f.chave)}
          >
            {f.rotulo}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(292px, 1fr))',
          gap: 16,
          marginTop: 16.8,
        }}
      >
        {visiveis.map((item) => {
          const botao = estadoDoBotao(item)
          return (
            <article className="card card-item" key={item.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 11.2 }}>
                <div>
                  <p className="card-kicker">{item.categoria}</p>
                  <p className="card-title" style={{ marginTop: 2.8 }}>
                    {item.nome}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--t45)' }}>{item.patrimonio}</p>
                </div>
                <Pill estado={situacao(item)} />
              </div>
              <p className="linha-detalhe">{linhaDetalhe(item)}</p>
              <button
                type="button"
                className={`btn btn-block ${botao.classe}`}
                disabled={botao.desabilitado}
                onClick={() => setParaSolicitar(item)}
              >
                {botao.rotulo}
              </button>
            </article>
          )
        })}
        {visiveis.length === 0 && (
          <div className="empty" style={{ gridColumn: '1 / -1', padding: 40 }}>
            <p>Nenhum equipamento encontrado para esta busca.</p>
          </div>
        )}
      </div>

      {paraSolicitar && (
        <Modal
          titulo="Solicitar empréstimo"
          corpo="Retirada no balcão de Operações."
          resumo={[
            { rotulo: 'Equipamento', valor: paraSolicitar.nome },
            {
              rotulo: 'Devolver até',
              valor: formatarData(somarDias(hojeAtual, PRAZO_PADRAO_DIAS)),
            },
          ]}
          rotuloConfirmar="Confirmar empréstimo"
          salvando={salvando}
          onConfirmar={confirmarSolicitacao}
          onFechar={() => setParaSolicitar(null)}
        />
      )}

    </main>
  )
}
