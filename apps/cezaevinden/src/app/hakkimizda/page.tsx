import Link from 'next/link'
import { HiScale, HiHeart, HiShieldCheck, HiUsers, HiHandRaised } from 'react-icons/hi2'

export const metadata = {
  title: 'Hakkımızda — Cezaevinden.com',
  description: 'Cezaevinden.com nedir, neden kuruldu ve kimler için?',
}

export default function HakkimizdaPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-navy-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <HiScale className="w-9 h-9 text-gold-500" />
        </div>
        <h1 className="text-3xl font-black text-navy-700 mb-3">
          Cezaevinden<span className="text-crimson-600">.com</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Türkiye'nin ilk ceza adaleti dayanışma ve destek platformu.
        </p>
      </div>

      {/* Misyon */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
          <HiHeart className="w-5 h-5 text-crimson-600" /> Misyonumuz
        </h2>
        <p className="text-gray-600 leading-relaxed mb-3">
          Türkiye'de 350.000'den fazla tutuklu ve hükümlü, milyonlarca aile üyesi ve tahliye olmuş
          birey sessizce mücadele veriyor. Bu insanlar hukuki haklarını bilmiyor, ailelerinden kopuk
          kalıyor, tahliye sonrası topluma entegrasyon konusunda yalnız bırakılıyor.
        </p>
        <p className="text-gray-600 leading-relaxed">
          <strong>Cezaevinden.com</strong>, bu insanları bir araya getirmek, seslerini duyurmak,
          gönüllü avukatlarla buluşturmak ve birbirlerine destek olmalarını sağlamak için kuruldu.
        </p>
      </div>

      {/* Değerler */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {[
          { icon: HiShieldCheck, title: 'Gizlilik Önce', color: 'text-blue-600', bg: 'bg-blue-50',
            desc: 'Anonim paylaşım modu, şifreli mesajlaşma ve veri minimizasyonu ile gizliliğinizi koruyoruz.' },
          { icon: HiUsers, title: 'Kapsayıcı', color: 'text-green-600', bg: 'bg-green-50',
            desc: 'Mahkum, aile, avukat, gönüllü — herkes bu platformda eşit ve saygın bir şekilde yer bulur.' },
          { icon: HiScale, title: 'Tarafsız', color: 'text-navy-700', bg: 'bg-navy-50',
            desc: 'Siyasi görüş veya suç türüne bakmaksızın herkese eşit hizmet. Adalet herkese lazım.' },
          { icon: HiHandRaised, title: 'Gönüllülük', color: 'text-purple-600', bg: 'bg-purple-50',
            desc: 'Gönüllü avukatlar, destek grupları ve STK\'larla iş birliği içinde ücretsiz hizmet.' },
        ].map(({ icon: Icon, title, color, bg, desc }) => (
          <div key={title} className={`card p-5 border-l-4 border-current ${color}`}>
            <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
            <p className="text-sm text-gray-500">{desc}</p>
          </div>
        ))}
      </div>

      {/* Rakamlar */}
      <div className="hero-gradient rounded-2xl p-6 text-white mb-6">
        <h2 className="text-lg font-bold mb-4 text-center">Platform İstatistikleri</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { v: '24.5K', l: 'Üye'              },
            { v: '380',   l: 'Gönüllü Avukat'  },
            { v: '8.2K',  l: 'Yanıtlanan Soru' },
            { v: '45',    l: 'Partner STK'      },
          ].map(({ v, l }) => (
            <div key={l}>
              <p className="text-2xl font-black">{v}</p>
              <p className="text-xs text-blue-200 mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-3">
        <p className="text-gray-500 text-sm">Siz de bu dayanışmanın bir parçası olun.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/kayit"        className="btn-primary">Üye Ol</Link>
          <Link href="/iletisim"     className="btn-secondary">İletişim</Link>
        </div>
      </div>
    </div>
  )
}
