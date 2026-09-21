import { create } from 'zustand'

interface ToastsState {
  mensagens: { id: number; texto: string }[]
  mostrar: (texto: string) => void
  remover: (id: number) => void
}

let contador = 0

/** Toast sai automaticamente em 2600ms (layout.md §5.6). */
export const useToasts = create<ToastsState>((set) => ({
  mensagens: [],
  mostrar: (texto) => {
    const id = ++contador
    set((s) => ({ mensagens: [...s.mensagens, { id, texto }] }))
    setTimeout(() => set((s) => ({ mensagens: s.mensagens.filter((m) => m.id !== id) })), 2600)
  },
  remover: (id) => set((s) => ({ mensagens: s.mensagens.filter((m) => m.id !== id) })),
}))
