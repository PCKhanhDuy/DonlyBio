import { createContext, useContext, useState, useCallback } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastCtx {
  toast: (message: string, type?: ToastType) => void
}

const Ctx = createContext<ToastCtx>({ toast: () => {} })
export const useToast = () => useContext(Ctx)

let nextId = 0

const ICONS: Record<ToastType, string> = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
  warning: '⚠',
}

const COLORS: Record<ToastType, string> = {
  success: '#333A2F',
  error:   '#dc2626',
  info:    '#2563eb',
  warning: '#d97706',
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++nextId
    setToasts(prev => [...prev.slice(-2), { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200)
  }, [])

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[600] flex flex-col items-center gap-2 pointer-events-none w-full px-4">
        {toasts.map(t => (
          <div key={t.id}
            className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-semibold text-white shadow-2xl max-w-sm w-auto"
            style={{ background: COLORS[t.type], animation: 'toastIn 0.25s cubic-bezier(0.22,0.68,0,1.2) both' }}>
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px] font-bold flex-shrink-0">
              {ICONS[t.type]}
            </span>
            {t.message}
          </div>
        ))}
      </div>
      <style>{`@keyframes toastIn{from{transform:translateY(16px) translateX(-50%);opacity:0}to{transform:translateY(0) translateX(-50%);opacity:1}}`}</style>
    </Ctx.Provider>
  )
}
