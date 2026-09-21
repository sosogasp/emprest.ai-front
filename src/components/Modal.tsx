import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export interface LinhaResumo {
  rotulo: string
  valor: string
}

interface ModalProps {
  titulo: string
  corpo?: string
  resumo: LinhaResumo[]
  rotuloConfirmar: string
  onConfirmar: () => void
  onFechar: () => void
}

/** Modal de 420px do layout.md §5.6: backdrop fecha por clique fora e por Esc. */
export function Modal({
  titulo,
  corpo,
  resumo,
  rotuloConfirmar,
  onConfirmar,
  onFechar,
}: ModalProps) {
  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [onFechar])

  return createPortal(
    <div
      className="dialog-backdrop"
      onClick={onFechar}
      role="presentation"
    >
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="dialog-title">{titulo}</h3>
        {corpo && <p className="dialog-body">{corpo}</p>}
        <div className="dialog-resumo">
          {resumo.map((linha) => (
            <div className="linha" key={linha.rotulo}>
              <span className="rotulo">{linha.rotulo}</span>
              <span className="valor">{linha.valor}</span>
            </div>
          ))}
        </div>
        <div className="dialog-actions">
          <button type="button" className="btn btn-secondary" onClick={onFechar}>
            Cancelar
          </button>
          <button type="button" className="btn btn-primary" onClick={onConfirmar}>
            {rotuloConfirmar}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
