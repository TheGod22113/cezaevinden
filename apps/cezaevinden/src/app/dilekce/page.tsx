'use client'

import { useState } from 'react'
import {
  HiDocumentText, HiClipboard, HiCheckCircle, HiXMark,
  HiMagnifyingGlass, HiBuildingLibrary, HiScale,
} from 'react-icons/hi2'

const SABLONLAR = [
  {
    id: 1,
    baslik: 'Denetimli Serbestlik Uzatma Dilekçesi',
    desc: 'DS süresinin uzatılması için ceza infaz kurumuna verilen dilekçe.',
    kurum: 'Denetimli Serbestlik Müdürlüğü',
    kategori: 'Denetimli Serbestlik',
    icerik: `[YER], [TARİH]

DENETİMLİ SERBESTLİK MÜDÜRLÜĞÜNE

Sayın Müdürlük,

Adım [AD SOYAD], T.C. Kimlik Numaram [TC KİMLİK NO]'dur. [DOSYA NO] sayılı dosya kapsamında denetimli serbestlik tedbiri altında bulunmaktayım.

[SEBEP: Hastalık/iş durumu/aile durumu vb.] nedeniyle denetimli serbestlik yükümlülüklerimi yerine getirmekte güçlük çekmekteyim. Bu nedenle, 5275 sayılı Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun'un ilgili hükümleri çerçevesinde denetimli serbestlik süremin yeniden değerlendirilmesini ve [TALEP EDİLEN DÜZENLEME] yapılmasını saygıyla talep ederim.

Gereğini bilgilerinize arz ederim.

[AD SOYAD]
[ADRES]
[TELEFON]
[TARİH]

Ekler:
1. T.C. Kimlik Belgesi fotokopisi
2. [Gerekli belgeler]`,
  },
  {
    id: 2,
    baslik: 'Koşullu Salıverilme Talebi',
    desc: 'Koşullu salıverilme için infaz hakimliğine yapılan başvuru dilekçesi.',
    kurum: 'İnfaz Hakimliği',
    kategori: 'Koşullu Salıverilme',
    icerik: `[YER], [TARİH]

[YER] İNFAZ HAKİMLİĞİNE

Sayın Hakimlik,

Ben [AD SOYAD], T.C. Kimlik Numaram [TC KİMLİK NO]'dur. [CEZA İNFAZ KURUMU ADI]'nda [CEZA MİKTARI] hapis cezası infaz etmekte olup hükümlü numarama [HÜKÜMLÜ NO]'dır.

5275 sayılı CGTİHK'nın 107. maddesi uyarınca, cezamın koşullu salıverilme için gerekli olan [ORAN: 2/3 veya 1/2]'sini tamamlamış bulunmaktayım. Ceza infaz kurumundaki iyi halim ve sosyal uyum durumum göz önünde bulundurularak tarafıma koşullu salıverilme kararı verilmesini saygıyla talep ederim.

Gereğini arz ederim.

[AD SOYAD]
[ADRES]
[TARİH]

Ekler:
1. T.C. Kimlik Belgesi fotokopisi
2. İkametgah belgesi`,
  },
  {
    id: 3,
    baslik: 'Açık Cezaevine Nakil Talebi',
    desc: 'Açık ceza infaz kurumuna geçiş başvurusu için dilekçe.',
    kurum: 'Ceza İnfaz Kurumu Müdürlüğü',
    kategori: 'Nakil',
    icerik: `[YER], [TARİH]

[CEZA İNFAZ KURUMU ADI] MÜDÜRLÜĞÜNE

Sayın Müdürlük,

Ben [AD SOYAD], T.C. Kimlik Numaram [TC KİMLİK NO], hükümlü numaram [HÜKÜMLÜ NO]'dır.

5275 sayılı CGTİHK'nın 14. maddesi ile Ceza İnfaz Kurumlarının Yönetimi ile Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Tüzük hükümleri kapsamında, cezamın [ORAN: 1/5]'ini kapalı kurumda iyi hal ile tamamlamış bulunmaktayım.

Bu nedenle açık ceza infaz kurumuna naklimin yapılması hususunda gereğini saygıyla arz ederim.

[AD SOYAD]
[ADRES]
[TARİH]`,
  },
  {
    id: 4,
    baslik: 'Ücretsiz Avukat (Müdafi) Atanması Talebi',
    desc: 'Baro tarafından ücretsiz avukat atanması için yapılan talep.',
    kurum: 'Baro Başkanlığı / Mahkeme',
    kategori: 'Hukuki Yardım',
    icerik: `[YER], [TARİH]

[İL] BAROSU BAŞKANLIĞINA

Sayın Başkanlık,

Ben [AD SOYAD], T.C. Kimlik Numaram [TC KİMLİK NO]'dur. [DAVA/DOSYA AÇIKLAMASI] nedeniyle yargılanmakta/ceza infaz etmekteyim.

Maddi imkansızlık nedeniyle avukat tutma gücüne sahip değilim. Ceza Muhakemesi Kanunu'nun 150. maddesi uyarınca tarafıma ücretsiz müdafi atanmasını saygıyla talep ederim.

Gereğini bilgilerinize arz ederim.

[AD SOYAD]
[ADRES]
[TELEFON]
[TARİH]

Ekler:
1. T.C. Kimlik Belgesi fotokopisi
2. Fakirlik ilmuhaberi / Gelir belgesi`,
  },
  {
    id: 5,
    baslik: 'Cezaevi Koşulları Şikayeti',
    desc: 'İnsan hakları ihlali veya cezaevi koşullarına ilişkin şikayet dilekçesi.',
    kurum: 'Cumhuriyet Başsavcılığı / İnfaz Hakimliği',
    kategori: 'Şikayet',
    icerik: `[YER], [TARİH]

[YER] CUMHURİYET BAŞSAVCILIĞINA

Sayın Savcılık,

Ben [AD SOYAD], T.C. Kimlik Numaram [TC KİMLİK NO], [CEZA İNFAZ KURUMU]'nda hükümlü/tutuklu olarak bulunmaktayım.

[TARİH] tarihinde/tarihinden itibaren [YAŞANAN İHLAL/SORUN: Hücre koşulları, sağlık hakkı ihlali, fiziksel müdahale vb.] yaşanmıştır. Bu durum Anayasa'nın 17. maddesi ile Avrupa İnsan Hakları Sözleşmesi'nin 3. maddesinde güvence altına alınan insan onuruna yakışır muamele hakkını ihlal etmektedir.

Söz konusu ihlallerin soruşturularak gereği yapılmasını saygıyla talep ederim.

[AD SOYAD]
[ADRES]
[TARİH]`,
  },
  {
    id: 6,
    baslik: 'İyi Hal Belgesi Talebi',
    desc: 'Ceza infaz kurumundan iyi hal belgesi talep dilekçesi.',
    kurum: 'Ceza İnfaz Kurumu Müdürlüğü',
    kategori: 'Belge Talebi',
    icerik: `[YER], [TARİH]

[CEZA İNFAZ KURUMU ADI] MÜDÜRLÜĞÜNE

Sayın Müdürlük,

Ben [AD SOYAD], T.C. Kimlik Numaram [TC KİMLİK NO], hükümlü numaram [HÜKÜMLÜ NO]'dır. Kurumunuzda [SÜRE]'dir infazımı sürdürmekteyim.

Koşullu salıverilme/denetimli serbestlik başvurumda kullanmak üzere, iyi hal durumumu gösterir resmi belgenin tarafıma verilmesini saygıyla arz ederim.

[AD SOYAD]
[TARİH]`,
  },
  {
    id: 7,
    baslik: 'Tahliye Sonrası Adres Bildirimi',
    desc: 'DS yükümlülükleri için güncel adres bildirimi dilekçesi.',
    kurum: 'Denetimli Serbestlik Müdürlüğü',
    kategori: 'Denetimli Serbestlik',
    icerik: `[YER], [TARİH]

DENETİMLİ SERBESTLİK MÜDÜRLÜĞÜNE

Sayın Müdürlük,

Adım [AD SOYAD], T.C. Kimlik Numaram [TC KİMLİK NO]'dur. [DOSYA NO] sayılı dosya kapsamında denetimli serbestlik tedbiri altında bulunmaktayım.

[ESKİ ADRES] adresinden [YENİ ADRES] adresine taşınmış bulunmaktayım. Yükümlülüklerimi yeni adresimden sürdüreceğimden, adres güncellemesinin yapılmasını saygıyla arz ederim.

[AD SOYAD]
[TELEFON]
[TARİH]`,
  },
  {
    id: 8,
    baslik: 'İnfaz Erteleme Talebi',
    desc: 'Sağlık veya ailevi sebeplerle ceza infazının ertelenmesi talebi.',
    kurum: 'Cumhuriyet Savcılığı / Mahkeme',
    kategori: 'İnfaz',
    icerik: `[YER], [TARİH]

[YER] CUMHURİYET BAŞSAVCILIĞINA

Sayın Savcılık,

Ben [AD SOYAD], T.C. Kimlik Numaram [TC KİMLİK NO]'dur. [MAHKEME ADI]'nın [KARAR TARİHİ] tarihli ve [ESAS NO] sayılı kararıyla [CEZA MİKTARI] hapis cezasına hükmedilmiştir.

5275 sayılı CGTİHK'nın 16. maddesi uyarınca, [GEREKÇE: Ağır hastalık/gebe olma/doğum/yeni doğan çocuk] nedeniyle cezamın [SÜRE] süreyle ertelenmesini saygıyla talep ederim.

Gereğini bilgilerinize arz ederim.

[AD SOYAD]
[ADRES]
[TELEFON]
[TARİH]

Ekler:
1. [Sağlık raporu / Doğum belgesi vb.]
2. T.C. Kimlik Belgesi fotokopisi`,
  },
]

const KATEGORİLER = ['Tümü', 'Denetimli Serbestlik', 'Koşullu Salıverilme', 'Nakil', 'Hukuki Yardım', 'Şikayet', 'Belge Talebi', 'İnfaz']

export default function DilecePage() {
  const [search, setSearch] = useState('')
  const [kategori, setKategori] = useState('Tümü')
  const [acik, setAcik] = useState<number | null>(null)
  const [kopyalandi, setKopyalandi] = useState<number | null>(null)

  const filtered = SABLONLAR.filter(s => {
    const q = search.toLowerCase()
    const matchSearch = !q || s.baslik.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)
    const matchKat = kategori === 'Tümü' || s.kategori === kategori
    return matchSearch && matchKat
  })

  const kopyala = (id: number, icerik: string) => {
    navigator.clipboard.writeText(icerik)
    setKopyalandi(id)
    setTimeout(() => setKopyalandi(null), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Hero */}
      <div className="hero-gradient rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <HiDocumentText className="w-6 h-6 text-gold-500" />
          <h1 className="text-2xl font-bold">Dilekçe Şablonları</h1>
        </div>
        <p className="text-blue-100 text-sm max-w-2xl">
          Cezaevi süreçlerinizde kullanabileceğiniz ücretsiz dilekçe şablonları.
          Köşeli parantez içindeki alanları kendi bilgilerinizle doldurun.
        </p>
      </div>

      {/* Uyarı */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
        <strong>Not:</strong> Bu şablonlar bilgilendirme amaçlıdır. Hukuki süreçlerde bir avukattan destek almanız önerilir.{' '}
        <a href="/hukuki-yardim" className="font-semibold underline">Ücretsiz hukuki yardım için tıklayın →</a>
      </div>

      {/* Filtreler */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Dilekçe ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <select
          value={kategori}
          onChange={e => setKategori(e.target.value)}
          className="input-field sm:w-52"
        >
          {KATEGORİLER.map(k => <option key={k}>{k}</option>)}
        </select>
      </div>

      {/* Şablonlar */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map(s => (
          <div key={s.id} className="card p-5 flex flex-col">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <HiDocumentText className="w-5 h-5 text-navy-700" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-gray-900 text-sm leading-tight">{s.baslik}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mb-4">
              <HiBuildingLibrary className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500">{s.kurum}</span>
            </div>
            <div className="mt-auto flex gap-2">
              <button
                onClick={() => setAcik(s.id)}
                className="flex-1 btn-primary text-sm py-2"
              >
                Şablonu Görüntüle
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="sm:col-span-2 card p-10 text-center text-gray-400">
            <HiDocumentText className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p>Arama kriterlerinize uygun şablon bulunamadı.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {acik !== null && (() => {
        const s = SABLONLAR.find(x => x.id === acik)!
        return (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div>
                  <h2 className="font-bold text-gray-900">{s.baslik}</h2>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <HiScale className="w-3.5 h-3.5" /> {s.kurum}
                  </p>
                </div>
                <button onClick={() => setAcik(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl">
                  <HiXMark className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5">
                <pre className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed border border-gray-200 max-h-96 overflow-y-auto">
                  {s.icerik}
                </pre>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => kopyala(s.id, s.icerik)}
                    className="flex-1 flex items-center justify-center gap-2 btn-primary"
                  >
                    {kopyalandi === s.id
                      ? <><HiCheckCircle className="w-4 h-4" /> Kopyalandı!</>
                      : <><HiClipboard className="w-4 h-4" /> Panoya Kopyala</>
                    }
                  </button>
                  <button onClick={() => setAcik(null)} className="btn-secondary">
                    Kapat
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-3 text-center">
                  Köşeli parantez [ ] içindeki alanları kendi bilgilerinizle doldurun.
                </p>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Alt yardım */}
      <div className="card p-6 mt-6 text-center">
        <HiScale className="w-10 h-10 text-navy-700 mx-auto mb-3" />
        <h3 className="font-bold text-gray-900 mb-1">Daha Fazla Yardıma mı İhtiyacınız Var?</h3>
        <p className="text-sm text-gray-500 mb-4">Gönüllü avukatlarımız hukuki sorularınızı ücretsiz yanıtlıyor.</p>
        <a href="/hukuki-yardim" className="btn-primary inline-flex items-center gap-2">
          Avukata Sor →
        </a>
      </div>
    </div>
  )
}
