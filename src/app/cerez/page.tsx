export const metadata = { title: 'Çerez Politikası — Cezaevinden.com' }

export default function CerezPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-black text-navy-700 mb-2">Çerez Politikası</h1>
      <p className="text-sm text-gray-400 mb-8">Son güncelleme: Mart 2025</p>
      <div className="card p-6 space-y-5 text-sm text-gray-700 leading-relaxed">
        <div>
          <h2 className="font-bold text-gray-900 mb-1">Kullandığımız Çerezler</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs mt-2">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 font-semibold text-gray-600">Çerez</th>
                  <th className="text-left p-2 font-semibold text-gray-600">Tür</th>
                  <th className="text-left p-2 font-semibold text-gray-600">Amaç</th>
                  <th className="text-left p-2 font-semibold text-gray-600">Süre</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { name: 'next-auth.session-token', type: 'Zorunlu',  purpose: 'Oturum yönetimi',           duration: 'Oturum' },
                  { name: 'cookie-consent',           type: 'Zorunlu',  purpose: 'Çerez onayı kaydı',          duration: '1 yıl'  },
                  { name: '__Host-next-auth.csrf-token',type:'Güvenlik', purpose: 'CSRF koruması',              duration: 'Oturum' },
                ].map(r => (
                  <tr key={r.name}>
                    <td className="p-2 font-mono text-navy-700">{r.name}</td>
                    <td className="p-2"><span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">{r.type}</span></td>
                    <td className="p-2 text-gray-600">{r.purpose}</td>
                    <td className="p-2 text-gray-500">{r.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h2 className="font-bold text-gray-900 mb-1">Reklam veya Takip Çerezi</h2>
          <p>Platformumuzda <strong>hiçbir reklam veya takip çerezi kullanılmamaktadır.</strong> Google Analytics, Facebook Pixel veya benzeri araçlar kullanılmaz.</p>
        </div>
        <div>
          <h2 className="font-bold text-gray-900 mb-1">Çerezleri Yönetmek</h2>
          <p>Tarayıcı ayarlarınızdan çerezleri silebilirsiniz. Zorunlu çerezleri silmeniz durumunda oturum açma özelliği çalışmayabilir.</p>
        </div>
      </div>
    </div>
  )
}
