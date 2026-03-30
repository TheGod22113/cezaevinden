import Link from 'next/link'
import { HiScale } from 'react-icons/hi2'

const links = {
  'Platform': [
    { label: 'Ana Sayfa',     href: '/'              },
    { label: 'Forum',         href: '/forum'          },
    { label: 'Hukuki Yardım', href: '/hukuki-yardim'  },
    { label: 'Haberler',      href: '/haberler'       },
    { label: 'Destek Ağı',   href: '/destek'         },
  ],
  'Topluluk': [
    { label: 'Üye Ol',          href: '/kayit'          },
    { label: 'Giriş Yap',       href: '/giris'          },
    { label: 'Gönüllü Avukat Ol', href: '/kayit'        },
    { label: 'Arama',           href: '/ara'            },
  ],
  'Hukuki': [
    { label: 'KVKK',              href: '/kvkk'             },
    { label: 'Kullanım Koşulları', href: '/kullanim-kosullari' },
    { label: 'Gizlilik Politikası', href: '/gizlilik'        },
    { label: 'Çerez Politikası',  href: '/cerez'            },
  ],
  'Kurumsal': [
    { label: 'Hakkımızda',  href: '/hakkimizda'  },
    { label: 'İletişim',    href: '/iletisim'    },
    { label: 'Basın',       href: '/basin'       },
    { label: 'Bağış Yap',  href: '/bagis'       },
  ],
}

export default function Footer({ className }: { className?: string }) {
  return (
    <footer className={`bg-navy-800 text-white mt-16 ${className ?? ''}`}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          {/* Marka */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
                <HiScale className="w-5 h-5 text-navy-700" />
              </div>
              <div>
                <span className="font-bold text-white">Cezaevinden</span>
                <span className="font-bold text-crimson-500">.com</span>
              </div>
            </Link>
            <p className="text-xs text-blue-200 leading-relaxed">
              Mahkumlar, aileler ve gönüllü avukatların dayanışma platformu.
            </p>
            <div className="flex gap-3 mt-4">
              {['𝕏', 'in', 'f'].map((s, i) => (
                <button key={i} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-sm font-bold transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Linkler */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h3 className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-3">{title}</h3>
              <ul className="space-y-2">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-blue-100 hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-300">
          <p>© 2025 Cezaevinden.com — Tüm hakları saklıdır.</p>
          <p className="text-center">
            Bu platform bilgilendirme amaçlıdır. Hukuki tavsiye yerine geçmez.
          </p>
        </div>
      </div>
    </footer>
  )
}
