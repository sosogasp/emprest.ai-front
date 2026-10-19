import type { EquipamentosDtoItensItem, EmprestimosDtoItensItem, PerfilDto, CriarEquipamentoDto } from '@/api/gerado'
import { estaAtrasado } from '@/lib/format'

export type Papel = PerfilDto['papel']
export type Equipamento = EquipamentosDtoItensItem
export type Emprestimo = EmprestimosDtoItensItem
export type Categoria = CriarEquipamentoDto['categoria']
export type Situacao = 'disponivel' | 'emprestado' | 'manutencao'
export const PRAZO_PADRAO_DIAS = 14
export const LIMITE_ITENS = 3
export function emprestimosDe(id: string, emprestimos: Emprestimo[]) { return emprestimos.filter((l) => l.pessoaId === id) }
export function emprestimoDoItem(item: Equipamento, emprestimos: Emprestimo[]) { return emprestimos.find((l) => l.equipamentoId === item.id) }
export function situacaoDoEquipamento(item: Equipamento, emprestimos: Emprestimo[]): Situacao {
  if (item.manutencao) return 'manutencao'
  return emprestimoDoItem(item, emprestimos) ? 'emprestado' : 'disponivel'
}
export function temAtraso(id: string, emprestimos: Emprestimo[], hoje: string) { return emprestimosDe(id, emprestimos).some((l) => estaAtrasado(l.prazo, hoje)) }
