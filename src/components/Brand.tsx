import { cn } from '@/lib/utils'

/** Marca: quadrado no acento + "EMPREST" 700 + ".AI" no acento (layout.md §2). */
export function Brand({ className }: { className?: string }) {
  return (
    <span className={cn('brand', className)}>
      <span className="brand-mark" aria-hidden="true" />
      <span className="brand-name">
        EMPREST<span className="ai">.AI</span>
      </span>
    </span>
  )
}
