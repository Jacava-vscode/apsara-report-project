import React, { useEffect } from 'react'

export default function Toast({ data, onClose }) {
  useEffect(() => {
    if (!data) return
    const t = setTimeout(() => onClose && onClose(), 3500)
    return () => clearTimeout(t)
  }, [data, onClose])

  if (!data) return null

  return (
    <div className={`toast ${data.type || 'info'}`} role="status" aria-live="polite">
      <div className="toast-inner">
        <span>{data.text}</span>
        <button aria-label="Close notification" onClick={() => onClose && onClose()}>✕</button>
      </div>
    </div>
  )
}
