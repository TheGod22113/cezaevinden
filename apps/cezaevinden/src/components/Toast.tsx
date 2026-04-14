'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { HiCheckCircle, HiXCircle, HiInformationCircle, HiXMark } from 'react-icons/hi2'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(p => [...p, { id, message, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500)
  }, [])

  const remove = (id: string) => setToasts(p => p.filter(t => t.id !== id))

  const icons = {
    success: <HiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />,
    error:   <HiXCircle    className="w-5 h-5 text-red-500   flex-shrink-0" />,
    info:    <HiInformationCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />,
  }

  const colors = {
    success: 'border-green-200 bg-green-50',
    error:   'border-red-200   bg-red-50',
    info:    'border-blue-200  bg-blue-50',
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-20 lg:bottom-6 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium text-gray-800 max-w-xs pointer-events-auto animate-fade-in ${colors[t.type]}`}
          >
            {icons[t.type]}
            <span className="flex-1">{t.message}</span>
            <button onClick={() => remove(t.id)} className="text-gray-400 hover:text-gray-600 ml-1">
              <HiXMark className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
