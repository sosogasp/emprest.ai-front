import { cn } from '@/lib/utils'

export type EstadoPill = 'disponivel' | 'emprestado' | 'atraso' | 'manutencao'

const CLASSE: Record<EstadoPill, string> = {
  disponivel: 'pill-ok',
  emprestado: 'pill-warn',
  atraso: 'pill-late',
  manutencao: 'pill-off',
}

const ROTULO: Record<EstadoPill, string> = {
  disponivel: 'Disponível',
  emprestado: 'Emprestado',
  atraso: 'Em atraso',
  manutencao: 'Em manutenção',
}

export function Pill({
  estado,
  rotulo,
  className,
}: {
  estado: EstadoPill
  rotulo?: string
  className?: string
}) {
  return (
    <span className={cn('pill', CLASSE[estado], className)}>
      {rotulo ?? ROTULO[estado]}
    </span>
  )
}
