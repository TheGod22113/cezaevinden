'use client'

import { useEffect, useRef, useCallback } from 'react'

interface InfiniteScrollProps {
  onLoadMore: () => void
  hasMore: boolean
  isLoading: boolean
}

export default function InfiniteScroll({ onLoadMore, hasMore, isLoading }: InfiniteScrollProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [hasMore, isLoading, onLoadMore])

  if (!hasMore) return null

  return (
    <div ref={ref} className="py-8 text-center text-gray-400">
      {isLoading ? (
        <div className="inline-flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      ) : (
        <p className="text-sm">Kaydırarak daha fazla göster...</p>
      )}
    </div>
  )
}
