import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import type { Categoria } from '@/data/emprestimos'
import { useDados } from '@/data/dados'
import { useToasts } from '@/store/toasts'

const schema = z.object({
  nome: z.string().min(1, 'Informe o nome do equipamento'),
  categoria: z.custom<Categoria>(),
  patrimonio: z.string(),
  observacao: z.string(),
  manutencao: z.enum(['disponivel', 'manutencao']),
})

type FormEquipamento = z.infer<typeof schema>

const CATEGORIAS: Categoria[] = ['Notebook', 'Monitor', 'Cabo', 'Câmera', 'Acessório']

const REGRAS = [
  'Cada pessoa fica com no máximo 3 itens ao mesmo tempo',
  'Prazo padrão de devolução de 14 dias',
  'Item em atraso bloqueia novo empréstimo',
  'Equipamento em manutenção não aparece como disponível',
]

const FORA_DA_V1 = ['Reserva com data futura', 'Notificação por e-mail', 'Importação da planilha']

/** Cadastro de equipamentos (Operações) — layout.md §5.5, grade 1fr/300px. */
export default function Equipamentos() {
  const { cadastrar, salvando } = useDados()
  const mostrar = useToasts((s) => s.mostrar)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormEquipamento>({
    resolver: zodResolver(schema),
    defaultValues: { nome: '', categoria: 'Notebook', patrimonio: '', observacao: '', manutencao: 'disponivel' },
  })

  async function aoCadastrar(valores: FormEquipamento) {
    if (salvando) return
    try {
    await cadastrar({
      nome: valores.nome,
      categoria: valores.categoria,
      // patrimônio vazio cai para TI-— (regra 10)
      patrimonio: valores.patrimonio.trim() || 'TI-—',
      observacao: valores.observacao,
      manutencao: valores.manutencao === 'manutencao',
    })
    mostrar('Equipamento cadastrado')
    void navigate('/operacoes')
    } catch (error) { mostrar(error instanceof Error ? error.message : 'Não foi possível cadastrar') }
  }

  function aoFalhar() {
    if (errors.nome) mostrar(errors.nome.message ?? 'Informe o nome do equipamento')
  }

  return (
    <main style={{ padding: '36px 40px 64px', maxWidth: 1160, margin: '0 auto', width: '100%' }}>
      <header className="page-head">
        <div>
          <h1 className="page-title">Equipamentos</h1>
          <p className="page-lead">Cadastro de equipamentos do estoque de TI</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 34, marginTop: 22.4, alignItems: 'start' }}>
        <form
          className="card"
          style={{ padding: 22.4, display: 'flex', flexDirection: 'column', gap: 11.2 }}
          onSubmit={handleSubmit(aoCadastrar, aoFalhar)}
          noValidate
        >
          <div style={{ display: 'grid', gridTemplateColumns: '2fr', gap: 11.2 }}>
            <div className="field">
              <label htmlFor="nome">Nome</label>
              <input id="nome" className="input" placeholder="Notebook Dell Latitude 5450" {...register('nome')} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="field">
              <label htmlFor="categoria">Categoria</label>
              <select id="categoria" className="input" {...register('categoria')}>
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="patrimonio">Patrimônio</label>
              <input id="patrimonio" className="input" placeholder="TI-0142" {...register('patrimonio')} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="observacao">Observações</label>
            <textarea
              id="observacao"
              className="input"
              placeholder="Ex.: painel com falha, previsão de retorno…"
              {...register('observacao')}
            />
          </div>
          <div style={{ display: 'flex', gap: 16.8 }}>
            <label className="radio">
              <input type="radio" value="disponivel" {...register('manutencao')} />
              <span className="dot" aria-hidden="true" />
              Disponível
            </label>
            <label className="radio">
              <input type="radio" value="manutencao" {...register('manutencao')} />
              <span className="dot" aria-hidden="true" />
              Em manutenção
            </label>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 8.4,
              marginTop: 5.6,
              paddingTop: 16.8,
              borderTop: '1px solid var(--color-divider)',
            }}
          >
            <button type="button" className="btn btn-ghost" onClick={() => void navigate('/operacoes')}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Cadastrar equipamento
            </button>
          </div>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16.8 }}>
          <section className="card" style={{ padding: 16.8 }}>
            <p className="card-kicker">Regras em vigor</p>
            <ul style={{ listStyle: 'none', margin: '11.2px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 8.4 }}>
              {REGRAS.map((r) => (
                <li key={r} style={{ display: 'flex', gap: 8.4, fontSize: 13, color: 'var(--t72)' }}>
                  <span style={{ color: 'var(--color-accent)' }} aria-hidden="true">
                    —
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </section>
          <section className="card" style={{ padding: 16.8, opacity: 0.42 }}>
            <p className="card-kicker">Fora desta versão</p>
            <ul style={{ listStyle: 'none', margin: '11.2px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 8.4 }}>
              {FORA_DA_V1.map((f) => (
                <li key={f} style={{ fontSize: 13 }}>
                  {f}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

    </main>
  )
}
