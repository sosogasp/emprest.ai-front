import { create } from 'zustand'
import type { Papel } from '@/data/demo'

export interface Usuario {
  /** Identifica a pessoa nos dados (demo: p1 = Ana Ribeiro, p6 = Operações). */
  id: string
  nome: string
  iniciais: string
  papel: Papel
}

interface AuthState {
  usuario: Usuario | null
  entrarDemo: (papel: Papel) => void
  entrar: (usuario: Usuario) => void
  sair: () => void
}

export const useAuth = create<AuthState>((set) => ({
  usuario: null,
  /** Modo demonstração (fase de protótipo visual, dados do layout.md §9). */
  entrarDemo: (papel) =>
    set({
      usuario:
        papel === 'Operações'
          ? { id: 'p6', nome: 'Operações', iniciais: 'OP', papel: 'Operações' }
          : { id: 'p1', nome: 'Ana Ribeiro', iniciais: 'AR', papel: 'Colaborador' },
    }),
  entrar: (usuario) => set({ usuario }),
  sair: () => set({ usuario: null }),
}))
