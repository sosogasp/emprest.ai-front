import { cn } from '@/lib/utils'

interface AvatarProps {
  iniciais: string
  neutro?: boolean
  pequeno?: boolean
}

/** Avatar com iniciais — accent no usuário logado, neutro na tabela (layout.md §1). */
export function Avatar({ iniciais, neutro, pequeno }: AvatarProps) {
  return (
    <span
      className={cn('avatar', neutro && 'avatar-neutral', pequeno && 'avatar-sm')}
      aria-hidden="true"
    >
      {iniciais}
    </span>
  )
}
