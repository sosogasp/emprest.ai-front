/** Datas no formato DD/MM/AAAA, idioma da interface em pt-BR (layout.md). */

export function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split('-')
  return `${dia}/${mes}/${ano}`
}

/** Devolve a data ISO (AAAA-MM-DD) de `iso` deslocada em `dias`. */
export function somarDias(iso: string, dias: number): string {
  const d = new Date(`${iso}T12:00:00`)
  d.setDate(d.getDate() + dias)
  return d.toISOString().slice(0, 10)
}

/** Compara apenas o dia (as datas de exemplo não têm hora). */
export function estaAtrasado(prazoISO: string, hojeISO: string): boolean {
  return prazoISO < hojeISO
}

/** Duas letras iniciais para o avatar. */
export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/)
  const primeira = partes[0]?.[0] ?? ''
  const segunda = partes.length > 1 ? (partes[partes.length - 1]?.[0] ?? '') : (partes[0]?.[1] ?? '')
  return (primeira + segunda).toUpperCase()
}
