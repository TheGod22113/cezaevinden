import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function timeAgo(date: Date | string): string {
  const now  = new Date()
  const then = new Date(date)
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000)

  if (diff < 60)   return `${diff} saniye önce`
  if (diff < 3600) return `${Math.floor(diff / 60)} dakika önce`
  if (diff < 86400)return `${Math.floor(diff / 3600)} saat önce`
  if (diff < 604800) return `${Math.floor(diff / 86400)} gün önce`
  return then.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function truncate(str: string, len: number) {
  return str.length > len ? str.slice(0, len) + '…' : str
}

export const roleLabels: Record<string, string> = {
  MAHKUM: 'Tutuklu/Hükümlü', AILE: 'Aile Üyesi', AVUKAT: 'Avukat',
  TAHLIYE: 'Tahliye Olmuş',  GONULLU: 'Gönüllü', ADMIN: 'Yönetici',
}

// Returns color key used with badge-* CSS classes in globals.css
export const roleColors: Record<string, string> = {
  MAHKUM:  'orange',
  AILE:    'green',
  AVUKAT:  'blue',
  TAHLIYE: 'teal',
  GONULLU: 'purple',
  ADMIN:   'red',
}

export const roleBadgeClasses: Record<string, string> = {
  MAHKUM:  'bg-orange-100 text-orange-700',
  AILE:    'bg-green-100 text-green-700',
  AVUKAT:  'bg-blue-100 text-blue-700',
  TAHLIYE: 'bg-teal-100 text-teal-700',
  GONULLU: 'bg-purple-100 text-purple-700',
  ADMIN:   'bg-red-100 text-red-700',
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}
