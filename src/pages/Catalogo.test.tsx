import { afterEach, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import Catalogo from './Catalogo'
import type { Equipamento } from '@/data/emprestimos'
import type { PerfilDto } from '@/api/gerado'

interface Fixture { usuario: PerfilDto; item: Equipamento; outros: Equipamento[] }

const fixture = vi.hoisted((): Fixture => ({
  usuario: { id: 'u1', nome: 'Pessoa de teste', iniciais: 'PT', papel: 'Colaborador' },
  outros: [],
  item: { id: 'e1', nome: 'Notebook 14 polegadas', patrimonio: 'TI-0001', categoria: 'Notebook',
    manutencao: false, observacao: null, emprestimo: null,
    imagemUrl: 'https://xcqsvcqjkogrchktrmgn.supabase.co/storage/v1/object/public/equipamentos/equipamentos/TI-0001.png' },
}))

vi.mock('@/store/auth', () => ({ useAuth: (selector: (state: { usuario: typeof fixture.usuario }) => unknown) => selector(fixture) }))
vi.mock('@/store/toasts', () => ({ useToasts: () => vi.fn() }))
vi.mock('@/data/dados', () => ({ hoje: () => '2026-11-06', useDados: () => ({
  equipamentos: [fixture.item, ...fixture.outros], emprestimos: [], ativos: [], pessoas: [],
  solicitar: vi.fn(), carregando: false, erro: null, refazer: vi.fn(), salvando: false,
}) }))

const original = fixture.item.imagemUrl
afterEach(() => { fixture.item.imagemUrl = original; fixture.outros = [] })

it('005 CA-01: renderiza a foto da API e o crédito Pixabay', () => {
  const html = renderToStaticMarkup(<MemoryRouter><Catalogo /></MemoryRouter>)
  expect(html).toContain(`src="${fixture.item.imagemUrl}"`)
  expect(html).toContain('alt="Notebook 14 polegadas"')
  expect(html).toContain('href="https://pixabay.com/"')
})

it('005 CA-01: equipamento antigo sem foto continua utilizável', () => {
  fixture.item.imagemUrl = null
  const html = renderToStaticMarkup(<MemoryRouter><Catalogo /></MemoryRouter>)
  expect(html).not.toContain('<img')
  expect(html).toContain('Notebook 14 polegadas')
  expect(html).toContain('Solicitar empréstimo')
})

it('005 CA-01: renderiza os 12 equipamentos recebidos da API', () => {
  fixture.outros = Array.from({ length: 11 }, (_, i) => ({ ...fixture.item,
    id: `e${i + 2}`, patrimonio: `TI-${String(i + 2).padStart(4, '0')}` }))
  const html = renderToStaticMarkup(<MemoryRouter><Catalogo /></MemoryRouter>)
  expect(html.match(/<img /g)).toHaveLength(12)
  expect(html).toContain('TI-0012')
})
