export function EstadoDados({ carregando, erro, refazer }: { carregando: boolean; erro: Error | null; refazer: () => unknown }) {
  if (carregando) return <main className="empty" role="status">Carregando equipamentos…</main>
  if (erro) return <main className="empty"><p role="alert">{erro.message}</p><button className="btn btn-primary" onClick={() => void refazer()}>Tentar novamente</button></main>
  return null
}
