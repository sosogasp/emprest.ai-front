import { expect, it } from 'vitest'
import { somarDiasUteis } from './format'

it('005 CA-02: calcula a mesma devolução em 14 dias úteis do servidor', () => {
  expect(somarDiasUteis('2026-11-06', 14)).toBe('2026-11-26')
  expect(somarDiasUteis('2026-11-07', 1)).toBe('2026-11-09')
})
