import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getEquipamentos, getEmprestimos, postEmprestimo, postDevolucao, postEquipamento, type EquipamentosDtoItensItem, type EmprestimosDtoItensItem, type CriarEquipamentoDto } from '@/api/gerado'
import { useAuth } from '@/store/auth'

export function hoje() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
}

async function carregar() {
  const equipamentos: EquipamentosDtoItensItem[] = []
  const emprestimos: EmprestimosDtoItensItem[] = []
  let cursor: string | undefined
  do {
    const pagina = await getEquipamentos(cursor ? { cursor } : undefined)
    equipamentos.push(...pagina.itens)
    cursor = pagina.proximoCursor ?? undefined
  } while (cursor)
  do {
    const pagina = await getEmprestimos(cursor ? { cursor } : undefined)
    emprestimos.push(...pagina.itens)
    cursor = pagina.proximoCursor ?? undefined
  } while (cursor)
  const ativos = equipamentos.flatMap((e) => e.emprestimo ? [e.emprestimo] : [])
  return { equipamentos, emprestimos, ativos, pessoas: ativos.map((l) => l.pessoa) }
}

/** Carrega os dados do membro e invalida o cache somente após persistir mutações. */
export function useDados() {
  const usuario = useAuth((s) => s.usuario)
  const cache = useQueryClient()
  const query = useQuery({ queryKey: ['dados', usuario?.id], queryFn: carregar, enabled: Boolean(usuario), retry: 1 })
  const mutation = useMutation({
    mutationFn: async (acao: { tipo: 'solicitar' | 'devolver'; id: string } | { tipo: 'cadastrar'; item: CriarEquipamentoDto }) => {
      if (acao.tipo === 'cadastrar') return postEquipamento(acao.item)
      if (acao.tipo === 'devolver') return postDevolucao(acao.id)
      return postEmprestimo({ equipamentoId: acao.id })
    },
    onSuccess: () => cache.invalidateQueries({ queryKey: ['dados'] }),
  })
  return {
    equipamentos: query.data?.equipamentos ?? [], emprestimos: query.data?.emprestimos ?? [], ativos: query.data?.ativos ?? [], pessoas: query.data?.pessoas ?? [],
    carregando: query.isPending, erro: query.error, refazer: query.refetch, salvando: mutation.isPending,
    solicitar: (id: string) => mutation.mutateAsync({ tipo: 'solicitar', id }),
    devolver: (id: string) => mutation.mutateAsync({ tipo: 'devolver', id }),
    cadastrar: (item: CriarEquipamentoDto) => mutation.mutateAsync({ tipo: 'cadastrar', item }),
  }
}
