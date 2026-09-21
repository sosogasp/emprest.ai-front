import { useToasts } from '@/store/toasts'
import { createPortal } from 'react-dom'

/** Toast fixo no rodapé, sai em 2600ms (layout.md §5.6). */
export function ToastHost() {
  const mensagens = useToasts((s) => s.mensagens)
  if (mensagens.length === 0) return null

  return createPortal(
    <>
      {mensagens.map((m) => (
        <div className="toast" role="status" key={m.id}>
          {m.texto}
        </div>
      ))}
    </>,
    document.body,
  )
}
