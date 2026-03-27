import Link from 'next/link'
import { HiCalendar, HiMapPin, HiUsers, HiArrowRight } from 'react-icons/hi2'

const events = [
  {
    id: '1',
    title: 'Tahliye Sonrası Hukuki Haklar Semineri',
    date: '2025-04-15',
    time: '14:00',
    location: 'İstanbul, Kadıköy Kültür Merkezi',
    type: 'Seminer',
    organizer: 'Ceza İnfaz Derneği',
    attendees: 45,
    maxAttendees: 80,
    online: false,
    desc: 'Tahliye sonrasında karşılaşabileceğiniz hukuki süreçler ve haklarınız hakkında ücretsiz bilgi semineri.',
  },
  {
    id: '2',
    title: 'Online Hukuki Danışma Günü',
    date: '2025-04-20',
    time: '10:00',
    location: 'Çevrimiçi (Zoom)',
    type: 'Danışma',
    organizer: 'Gönüllü Avukatlar Platformu',
    attendees: 12,
    maxAttendees: 30,
    online: true,
    desc: 'Gönüllü avukatlarımızla birebir online görüşme fırsatı. Ücretsiz kayıt zorunludur.',
  },
  {
    id: '3',
    title: 'Aile Destek Toplantısı — Ankara',
    date: '2025-04-25',
    time: '15:30',
    location: 'Ankara, Çankaya',
    type: 'Destek Grubu',
    organizer: 'Cezaevi Aileleri Dayanışma',
    attendees: 28,
    maxAttendees: 50,
    online: false,
    desc: 'Tutuklu yakınları için psikolojik destek ve bilgi paylaşım toplantısı.',
  },
  {
    id: '4',
    title: 'İş Bulma ve Sosyal Uyum Atölyesi',
    date: '2025-05-03',
    time: '11:00',
    location: 'İzmir, Konak',
    type: 'Atölye',
    organizer: 'ÇÖZÜM Derneği',
    attendees: 19,
    maxAttendees: 25,
    online: false,
    desc: 'Tahliye sonrası iş piyasasına dönüş, CV hazırlama ve mülakat teknikleri atölyesi.',
  },
]

const typeColors: Record<string, string> = {
  'Seminer':       'bg-blue-100 text-blue-700',
  'Danışma':       'bg-green-100 text-green-700',
  'Destek Grubu':  'bg-purple-100 text-purple-700',
  'Atölye':        'bg-orange-100 text-orange-700',
}

export default function EtkinliklerPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <HiCalendar className="w-7 h-7 text-navy-700" /> Etkinlikler
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Seminerler, toplantılar ve destek grupları</p>
        </div>
        <span className="badge-navy text-xs px-3 py-1.5">{events.length} Etkinlik</span>
      </div>

      <div className="space-y-4">
        {events.map(ev => {
          const d = new Date(ev.date)
          const pct = Math.round((ev.attendees / ev.maxAttendees) * 100)
          const full = ev.attendees >= ev.maxAttendees
          return (
            <div key={ev.id} className="card p-5">
              <div className="flex items-start gap-4">
                {/* Date block */}
                <div className="w-14 flex-shrink-0 text-center bg-navy-700 text-white rounded-xl py-2">
                  <p className="text-xs uppercase tracking-wide opacity-75">
                    {d.toLocaleDateString('tr-TR', { month: 'short' })}
                  </p>
                  <p className="text-2xl font-black leading-none">{d.getDate()}</p>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h2 className="font-bold text-gray-900 text-sm leading-snug">{ev.title}</h2>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[ev.type] ?? 'bg-gray-100 text-gray-600'}`}>
                      {ev.type}
                    </span>
                    {ev.online && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">🌐 Online</span>}
                  </div>

                  <p className="text-xs text-gray-500 mb-2">{ev.desc}</p>

                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <HiCalendar className="w-3.5 h-3.5" />
                      {d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })} · {ev.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <HiMapPin className="w-3.5 h-3.5" /> {ev.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <HiUsers className="w-3.5 h-3.5" /> {ev.organizer}
                    </span>
                  </div>

                  {/* Capacity */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${full ? 'bg-red-400' : 'bg-navy-700'}`}
                        style={{ width: `${pct}%` }} />
                    </div>
                    <span className={`text-xs font-semibold ${full ? 'text-red-500' : 'text-gray-600'}`}>
                      {ev.attendees}/{ev.maxAttendees}
                    </span>
                  </div>

                  <button
                    disabled={full}
                    className={`text-sm font-semibold flex items-center gap-1 transition-colors ${
                      full
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-navy-700 hover:text-navy-900'
                    }`}>
                    {full ? 'Kontenjan Dolu' : 'Kayıt Ol'} {!full && <HiArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 card p-5 text-center border-dashed">
        <p className="text-gray-600 font-semibold mb-1">Etkinlik düzenlemek ister misiniz?</p>
        <p className="text-sm text-gray-500 mb-3">Dernek, kurum veya inisiyatif olarak etkinlik ekleyin.</p>
        <Link href="/iletisim" className="btn-primary inline-block px-5 py-2 text-sm">
          Bize Ulaşın
        </Link>
      </div>
    </div>
  )
}
