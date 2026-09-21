import { create } from 'zustand'
import { estaAtrasado, somarDias } from '@/lib/format'

/* Dados de exemplo da seção 9 do docs/layout.md — fase de protótipo visual.
   Quando o backend existir, este módulo sai e o dado passa a vir do cliente
   Orval via TanStack Query (checklist do rules/checks.md). */

export type Papel = 'Colaborador' | 'Operações'
export type Situacao = 'disponivel' | 'emprestado' | 'manutencao'
export type Categoria = 'Notebook' | 'Monitor' | 'Cabo' | 'Câmera' | 'Acessório'

export interface Pessoa {
  id: string
  nome: string
  iniciais: string
}

export interface Equipamento {
  id: string
  nome: string
  categoria: Categoria
  patrimonio: string
  manutencao?: boolean
  observacao?: string
}

export interface Emprestimo {
  id: string
  equipamentoId: string
  pessoaId: string
  retirada: string
  prazo: string
}

/** Data de referência da seção 9 do layout.md (31/08/2026). */
export const HOJE_DEMO = '2026-08-31'
export const PRAZO_PADRAO_DIAS = 14
export const LIMITE_ITENS = 3

export const PESSOAS: Pessoa[] = [
  { id: 'p1', nome: 'Ana Ribeiro', iniciais: 'AR' },
  { id: 'p2', nome: 'Marcos Lemos', iniciais: 'ML' },
  { id: 'p3', nome: 'Júlia Prado', iniciais: 'JP' },
  { id: 'p4', nome: 'Rafael Souza', iniciais: 'RS' },
  { id: 'p5', nome: 'Camila Nunes', iniciais: 'CN' },
  { id: 'p6', nome: 'Operações', iniciais: 'OP' },
]

interface DemoState {
  equipamentos: Equipamento[]
  emprestimos: Emprestimo[]
  solicitar: (equipamentoId: string, pessoaId: string, retirada: string) => void
  devolver: (emprestimoId: string) => void
  cadastrar: (novo: {
    nome: string
    categoria: Categoria
    patrimonio: string
    observacao?: string
    manutencao: boolean
  }) => void
}

export const useDemo = create<DemoState>((set) => ({
  equipamentos: [
    { id: 'e1', nome: 'Notebook Dell Latitude 5450', categoria: 'Notebook', patrimonio: 'TI-0142' },
    { id: 'e2', nome: 'MacBook Pro 14 M3', categoria: 'Notebook', patrimonio: 'TI-0088' },
    { id: 'e3', nome: 'Monitor LG 27" 4K', categoria: 'Monitor', patrimonio: 'TI-0231' },
    {
      id: 'e4',
      nome: 'Monitor Dell 24" FHD',
      categoria: 'Monitor',
      patrimonio: 'TI-0233',
      manutencao: true,
      observacao: 'Painel com falha, retorna em 05/09',
    },
    { id: 'e5', nome: 'Câmera Sony ZV-1', categoria: 'Câmera', patrimonio: 'TI-0301' },
    { id: 'e6', nome: 'Cabo HDMI 2.1 3m', categoria: 'Cabo', patrimonio: 'TI-0455' },
    { id: 'e7', nome: 'Dock Thunderbolt 4', categoria: 'Acessório', patrimonio: 'TI-0512' },
    {
      id: 'e8',
      nome: 'Tripé Manfrotto Befree',
      categoria: 'Acessório',
      patrimonio: 'TI-0318',
      manutencao: true,
      observacao: 'Trava do centro quebrada',
    },
    { id: 'e9', nome: 'Headset Jabra Evolve2', categoria: 'Acessório', patrimonio: 'TI-0402' },
    // Itens citados nos empréstimos em aberto do §9 (fora da lista de 9 do catálogo)
    { id: 'e10', nome: 'Notebook Lenovo T14', categoria: 'Notebook', patrimonio: 'TI-0119' },
    { id: 'e11', nome: 'Monitor AOC 24"', categoria: 'Monitor', patrimonio: 'TI-0244' },
    { id: 'e12', nome: 'Câmera GoPro Hero 12', categoria: 'Câmera', patrimonio: 'TI-0307' },
  ],
  emprestimos: [
    { id: 'l1', equipamentoId: 'e5', pessoaId: 'p1', retirada: '2026-08-29', prazo: '2026-09-12' },
    { id: 'l2', equipamentoId: 'e7', pessoaId: 'p1', retirada: '2026-08-22', prazo: '2026-09-05' },
    { id: 'l3', equipamentoId: 'e2', pessoaId: 'p2', retirada: '2026-08-24', prazo: '2026-09-07' },
    { id: 'l4', equipamentoId: 'e10', pessoaId: 'p3', retirada: '2026-08-26', prazo: '2026-09-09' },
    { id: 'l5', equipamentoId: 'e11', pessoaId: 'p4', retirada: '2026-08-18', prazo: '2026-09-01' },
    { id: 'l6', equipamentoId: 'e12', pessoaId: 'p5', retirada: '2026-08-05', prazo: '2026-08-19' },
  ],
  solicitar: (equipamentoId, pessoaId, retirada) =>
    set((s) => ({
      emprestimos: [
        ...s.emprestimos,
        {
          id: `l${crypto.randomUUID()}`,
          equipamentoId,
          pessoaId,
          retirada,
          prazo: somarDias(retirada, PRAZO_PADRAO_DIAS),
        },
      ],
    })),
  devolver: (emprestimoId) =>
    set((s) => ({ emprestimos: s.emprestimos.filter((l) => l.id !== emprestimoId) })),
  cadastrar: ({ nome, categoria, patrimonio, observacao, manutencao }) =>
    set((s) => ({
      // item entra no topo da lista (regra 10 do layout.md)
      equipamentos: [
        {
          id: `e${crypto.randomUUID()}`,
          nome,
          categoria,
          patrimonio,
          manutencao: manutencao || undefined,
          observacao: observacao || undefined,
        },
        ...s.equipamentos,
      ],
    })),
}))

/* ====== Derivações (toda mudança de dados é derivada no render — layout.md §10) ====== */

export function situacaoDoEquipamento(
  item: Equipamento,
  emprestimos: Emprestimo[],
): Situacao {
  if (item.manutencao) return 'manutencao'
  return emprestimos.some((l) => l.equipamentoId === item.id) ? 'emprestado' : 'disponivel'
}

export function emprestimoDoItem(
  item: Equipamento,
  emprestimos: Emprestimo[],
): Emprestimo | undefined {
  return emprestimos.find((l) => l.equipamentoId === item.id)
}

/** Empréstimos em aberto de uma pessoa. */
export function emprestimosDe(pessoaId: string, emprestimos: Emprestimo[]): Emprestimo[] {
  return emprestimos.filter((l) => l.pessoaId === pessoaId)
}

/** A pessoa tem algum item em atraso? (bloqueia novo empréstimo — regra 5) */
export function temAtraso(pessoaId: string, emprestimos: Emprestimo[]): boolean {
  return emprestimosDe(pessoaId, emprestimos).some((l) => estaAtrasado(l.prazo, HOJE_DEMO))
}
