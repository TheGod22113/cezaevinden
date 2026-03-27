'use client'

import { useState } from 'react'
import { HiHeart, HiCheckCircle, HiShieldCheck } from 'react-icons/hi2'

const amounts = [10, 25, 50, 100, 250]

export default function BagisPage() {
  const [selected, setSelected]   = useState(25)
  const [custom,   setCustom]     = useState('')
  const [monthly,  setMonthly]    = useState(false)
  const [done,     setDone]       = useState(false)

  const finalAmount = custom ? parseInt(custom) : selected

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <HiHeart className="w-9 h-9 text-crimson-600" />
        </div>
        <h1 className="text-2xl font-black text-navy-700 mb-2">Bağış Yap</h1>
        <p className="text-gray-500 text-sm">
          Desteğinizle platformu ayakta tutuyoruz. Her bağış, bir mahkumun ailesine veya tahliye olan birine ulaşıyor.
        </p>
      </div>

      {done ? (
        <div className="card p-8 text-center">
          <HiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Teşekkürler! 🙏</h2>
          <p className="text-gray-500 text-sm mb-4">
            <strong>{finalAmount}₺</strong> bağışınız alındı. Bu destek için minnettarız.
          </p>
          <button onClick={() => setDone(false)} className="btn-secondary text-sm">Tekrar Bağış Yap</button>
        </div>
      ) : (
        <div className="card p-6 space-y-5">
          {/* Tutar Seç */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Bağış Tutarı (₺)</p>
            <div className="grid grid-cols-5 gap-2 mb-3">
              {amounts.map(a => (
                <button key={a} onClick={() => { setSelected(a); setCustom('') }}
                  className={`py-2.5 rounded-xl font-bold text-sm transition-all ${
                    selected === a && !custom ? 'bg-navy-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                  {a}₺
                </button>
              ))}
            </div>
            <input type="number" value={custom} onChange={e => { setCustom(e.target.value); setSelected(0) }}
              className="input-field" placeholder="Farklı bir tutar girin..." min="1" />
          </div>

          {/* Aylık / Tek Seferlik */}
          <div className="flex gap-2">
            {[false, true].map(m => (
              <button key={String(m)} onClick={() => setMonthly(m)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  monthly === m ? 'bg-navy-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {m ? '🔄 Aylık Bağış' : '💛 Tek Seferlik'}
              </button>
            ))}
          </div>

          {/* Özet */}
          {finalAmount > 0 && (
            <div className="bg-navy-50 rounded-xl p-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Bağış Tutarı</span>
                <strong className="text-navy-700">{finalAmount}₺</strong>
              </div>
              {monthly && (
                <div className="flex justify-between text-gray-500 mt-1 text-xs">
                  <span>Her ay otomatik</span>
                  <span>İptal edilebilir</span>
                </div>
              )}
            </div>
          )}

          {/* Güvenlik */}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <HiShieldCheck className="w-4 h-4 text-green-500" />
            <span>256-bit SSL şifreleme ile güvenli ödeme</span>
          </div>

          <button onClick={() => finalAmount > 0 && setDone(true)}
            disabled={!finalAmount}
            className="w-full bg-crimson-600 hover:bg-crimson-700 disabled:bg-gray-200 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
            <HiHeart className="w-5 h-5" />
            {finalAmount ? `${finalAmount}₺ Bağış Yap` : 'Tutar Seçin'}
          </button>

          <p className="text-xs text-center text-gray-400">
            Bağışlar Cezaevinden Sosyal Yardım Derneği adına toplanmaktadır.
          </p>
        </div>
      )}

      {/* Nereye Gidiyor */}
      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
        {[
          { pct: '%60', label: 'Platform Altyapısı', icon: '🖥️' },
          { pct: '%30', label: 'Hukuki Destek',      icon: '⚖️' },
          { pct: '%10', label: 'Operasyonel',         icon: '🤝' },
        ].map(({ pct, label, icon }) => (
          <div key={label} className="card p-3 text-center">
            <p className="text-xl">{icon}</p>
            <p className="font-bold text-navy-700">{pct}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
