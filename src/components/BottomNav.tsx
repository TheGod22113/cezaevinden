'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HiHome,
  HiChatBubbleLeftRight,
  HiScale,
  HiEnvelope,
  HiBell,
} from 'react-icons/hi2'

const navItems = [
  { href: '/',              label: 'Ana Sayfa', icon: HiHome,                badge: null },
  { href: '/forum',         label: 'Forum',     icon: HiChatBubbleLeftRight, badge: '12' },
  { href: '/hukuki-yardim', label: 'Hukuki',    icon: HiScale,               badge: null, center: true },
  { href: '/mesajlar',      label: 'Mesajlar',  icon: HiEnvelope,            badge: '5'  },
  { href: '/bildirimler',   label: 'Bildirim',  icon: HiBell,                badge: '4'  },
]

export default function BottomNav() {
  const pathname = usePathname()

  // Hide on auth/admin pages
  const hidden = ['/giris', '/kayit', '/admin'].some(p => pathname.startsWith(p))
  if (hidden) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-200 safe-area-pb">
      <div className="flex items-stretch h-16">
        {navItems.map(({ href, label, icon: Icon, badge, center }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors ${
                center
                  ? 'mx-1'
                  : ''
              }`}
            >
              {center ? (
                /* Merkez — öne çıkan hukuki yardım butonu */
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
                  isActive
                    ? 'bg-navy-800 shadow-navy-200'
                    : 'bg-navy-700 hover:bg-navy-800 shadow-navy-200'
                }`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Icon className={`w-6 h-6 transition-colors ${
                      isActive ? 'text-navy-700' : 'text-gray-400'
                    }`} />
                    {badge && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-crimson-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                        {badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] font-medium leading-none transition-colors ${
                    isActive ? 'text-navy-700' : 'text-gray-400'
                  }`}>
                    {label}
                  </span>
                  {/* Active indicator dot */}
                  {isActive && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-navy-700 rounded-full" />
                  )}
                </>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
