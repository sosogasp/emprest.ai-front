import { describe, expect, it } from 'vitest'
import { emprestimosDe, situacaoDoEquipamento, temAtraso, type Equipamento, type Emprestimo } from './emprestimos'

const equipamento: Equipamento = { id: 'e1', nome: 'Notebook', patrimonio: 'TI-1', categoria: 'Notebook', manutencao: false, observacao: null, emprestimo: null }
const emprestimo: Emprestimo = { id: 'l1', equipamentoId: 'e1', pessoaId: 'u1', retirada: '2026-10-01', prazo: '2026-10-15', pessoa: { id: 'u1', nome: 'Pessoa', iniciais: 'P' } }

describe('003 — dados reais', () => {
  it('CA-04/06: separa empréstimos do usuário', () => { expect(emprestimosDe('u2', [emprestimo])).toEqual([]); expect(emprestimosDe('u1', [emprestimo])).toEqual([emprestimo]) })
  it('CA-05: manutenção prevalece e empréstimo reduz disponibilidade', () => {
    expect(situacaoDoEquipamento(equipamento, [])).toBe('disponivel')
    expect(situacaoDoEquipamento(equipamento, [emprestimo])).toBe('emprestado')
    expect(situacaoDoEquipamento({ ...equipamento, manutencao: true }, [emprestimo])).toBe('manutencao')
  })
  it('CA-05: atraso só bloqueia depois do prazo e pertence à pessoa', () => {
    expect(temAtraso('u1', [emprestimo], '2026-10-15')).toBe(false)
    expect(temAtraso('u1', [emprestimo], '2026-10-16')).toBe(true)
    expect(temAtraso('u2', [emprestimo], '2026-10-16')).toBe(false)
  })
})
