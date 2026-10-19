import { create } from 'zustand'
import type { PerfilDto } from '@/api/gerado'

export type Usuario = PerfilDto

interface AuthState {
  usuario: Usuario | null
  inicializando: boolean
  definirSessao: (usuario: Usuario | null) => void
  sair: () => void
}

export const useAuth = create<AuthState>((set) => ({
  usuario: null,
  inicializando: true,
  definirSessao: (usuario) => set({ usuario, inicializando: false }),
  sair: () => set({ usuario: null }),
}))
