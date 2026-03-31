'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  HiHome, HiNewspaper, HiScale, HiChatBubbleLeftRight,
  HiMagnifyingGlass, HiBars3, HiXMark, HiHandRaised,
  HiUserCircle, HiCog6Tooth, HiArrowRightOnRectangle,
  HiShieldCheck, HiBookmark,
} from 'react-icons/hi2'
import NotificationBell from './NotificationBell'

const navItems = [
  { href: '/',              label: 'Ana Sayfa',     icon: HiHome },
  { href: '/forum',         label: 'Forum',         icon: HiChatBubbleLeftRight },
  { href: '/hukuki-yardim', label: 'Hukuki Yardım', icon: HiScale },
  { href: '/haberler',      label: 'Haberler',      icon: HiNewspaper },
  { href: '/destek',        label: 'Destek Ağı',    icon: HiHandRaised },
]

export default function Header() {
  const pathname = usePathname()
  const router   = useRouter()
  const { data: session } = useSession()
  const user = session?.user as any

  const [mobileOpen, setMobileOpen]   = useState(false)
  const [searchOpen, setSearchOpen]   = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [query, setQuery]             = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/arama?q=${encodeURIComponent(query.trim())}`)
      setSearchOpen(false)
      setQuery('')
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-[96px]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            {/* Mobil: küçük logo */}
            <Image
              src="/logo.jpg"
              alt="Cezaevinden.com"
              width={64}
              height={64}
              className="rounded-full bg-white p-0.5 shadow-md sm:hidden"
              priority
            />
            {/* Masaüstü: büyük logo */}
            <Image
              src="/logo.jpg"
              alt=""
              width={88}
              height={88}
              className="rounded-full bg-white p-0.5 shadow-md hidden sm:block"
              priority
            />
            <div className="leading-tight hidden sm:block">
              <span className="text-white font-bold text-xl lg:text-2xl tracking-tight">Cezaevinden</span>
              <span className="text-crimson-500 font-bold text-xl lg:text-2xl">.com</span>
            </div>
            {/* Mobil: sadece kısa isim */}
            <div className="leading-tight sm:hidden">
              <span className="text-white font-bold text-base tracking-tight">Cezaevinden</span>
              <span className="text-crimson-500 font-bold text-base">.com</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === href
                    ? 'bg-white/20 text-white'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}>
                <Icon className="w-4 h-4" /> {label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            {/* Search */}
            <button onClick={() => setSearchOpen(o => !o)}
              aria-label="Ara"
              className="p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-all">
              <HiMagnifyingGlass className="w-5 h-5" />
            </button>

            {session ? (
              <>
                {/* Notification Bell */}
                <div className="text-blue-100">
                  <NotificationBell />
                </div>

                {/* Profile Dropdown */}
                <div className="relative hidden sm:block">
                  <button onClick={() => setProfileOpen(o => !o)}
                    aria-label="Profil menüsü"
                    className="flex items-center gap-2 p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                    <div className="w-7 h-7 bg-gold-500 rounded-full flex items-center justify-center text-navy-900 font-bold text-sm">
                      {user?.name?.charAt(0) ?? '?'}
                    </div>
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b">
                        <p className="font-semibold text-gray-900 text-sm truncate">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">@{user?.username}</p>
                      </div>
                      <div className="py-1">
                        {[
                          { href: `/profil/${user?.username}`, label: 'Profilim', icon: HiUserCircle },
                          { href: '/kaydedilenler',            label: 'Kaydedilenler', icon: HiBookmark },
                          { href: '/profil/ayarlar',           label: 'Ayarlar', icon: HiCog6Tooth },
                          ...(user?.role === 'ADMIN' ? [{ href: '/admin', label: 'Admin Panel', icon: HiShieldCheck }] : []),
                        ].map(({ href, label, icon: Icon }) => (
                          <Link key={href} href={href} onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            <Icon className="w-4 h-4 text-gray-400" /> {label}
                          </Link>
                        ))}
                        <button onClick={() => signOut({ callbackUrl: '/' })}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <HiArrowRightOnRectangle className="w-4 h-4" /> Çıkış Yap
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/giris"
                  className="px-3 py-1.5 text-sm text-blue-100 hover:text-white font-medium transition-colors">
                  Giriş Yap
                </Link>
                <Link href="/kayit"
                  className="px-3 py-1.5 text-sm bg-crimson-600 hover:bg-crimson-700 text-white font-semibold rounded-lg transition-colors">
                  Üye Ol
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMobileOpen(m => !m)}
              aria-label={mobileOpen ? 'Menüyü kapat' : 'Menüyü aç'}
              className="lg:hidden p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-all">
              {mobileOpen ? <HiXMark className="w-6 h-6" /> : <HiBars3 className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="pb-3">
            <form onSubmit={handleSearch} className="relative">
              <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Konu, kullanıcı veya haber ara…"
                className="w-full pl-10 pr-4 py-2.5 bg-white/10 text-white placeholder-blue-200 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                autoFocus
              />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-navy-800 border-t border-white/10">
          <nav className="px-4 py-3 space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  pathname === href
                    ? 'bg-white/20 text-white'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}>
                <Icon className="w-5 h-5" /> {label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/10 flex gap-2">
              {session ? (
                <>
                  <Link href={`/profil/${user?.username}`} onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2.5 text-sm text-blue-100 border border-white/20 rounded-lg font-medium">
                    Profilim
                  </Link>
                  <button onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex-1 text-center py-2.5 text-sm bg-crimson-600 text-white rounded-lg font-semibold">
                    Çıkış
                  </button>
                </>
              ) : (
                <>
                  <Link href="/giris" onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2.5 text-sm text-blue-100 border border-white/20 rounded-lg font-medium">
                    Giriş Yap
                  </Link>
                  <Link href="/kayit" onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2.5 text-sm bg-crimson-600 text-white rounded-lg font-semibold">
                    Üye Ol
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
