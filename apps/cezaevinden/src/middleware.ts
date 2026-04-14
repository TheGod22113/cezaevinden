import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token    = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Admin sayfalarını sadece ADMIN rolü görebilir
    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname

        // Bu sayfalar giriş gerektiriyor
        const protected_paths = [
          '/mesajlar', '/bildirimler', '/profil/ayarlar', '/admin',
        ]

        if (protected_paths.some(p => pathname.startsWith(p))) {
          return !!token
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: ['/mesajlar/:path*', '/bildirimler/:path*', '/profil/ayarlar/:path*', '/admin/:path*'],
}
