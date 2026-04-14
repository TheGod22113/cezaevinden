import { prisma } from '@/lib/prisma'
import { HiUsers, HiChatBubbleLeftRight, HiScale, HiNewspaper, HiCheckCircle } from 'react-icons/hi2'

async function getStats() {
  const [
    users, posts, topics, questions, answeredQ, lawyers,
  ] = await Promise.all([
    prisma.user.count({ where: { status: 'ACTIVE' } }),
    prisma.post.count(),
    prisma.forumTopic.count(),
    prisma.legalQuestion.count(),
    prisma.legalQuestion.count({ where: { isAnswered: true } }),
    prisma.user.count({ where: { role: 'AVUKAT', verified: true } }),
  ])
  return { users, posts, topics, questions, answeredQ, lawyers }
}

export default async function IstatistiklerPage() {
  const s = await getStats()
  const answerRate = s.questions > 0 ? Math.round((s.answeredQ / s.questions) * 100) : 0

  const stats = [
    { icon: HiUsers,               label: 'Aktif Üye',           value: s.users.toLocaleString('tr-TR'),   color: 'text-navy-700',   bg: 'bg-blue-50' },
    { icon: HiChatBubbleLeftRight,  label: 'Paylaşım & Forum',    value: (s.posts + s.topics).toLocaleString('tr-TR'), color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: HiScale,                label: 'Hukuki Soru',         value: s.questions.toLocaleString('tr-TR'), color: 'text-crimson-600', bg: 'bg-red-50' },
    { icon: HiCheckCircle,          label: 'Yanıtlanma Oranı',    value: `%${answerRate}`,                  color: 'text-green-600',  bg: 'bg-green-50' },
    { icon: HiNewspaper,            label: 'Gönüllü Avukat',      value: s.lawyers.toLocaleString('tr-TR'), color: 'text-gold-600',   bg: 'bg-yellow-50' },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Platform İstatistikleri</h1>
        <p className="text-gray-500">Canlı verilerle platformun etkisi</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((st, i) => (
          <div key={i} className={`card p-5 text-center ${st.bg} border-0`}>
            <st.icon className={`w-8 h-8 mx-auto mb-2 ${st.color}`} />
            <p className={`text-3xl font-black ${st.color}`}>{st.value}</p>
            <p className="text-sm text-gray-600 mt-1 font-medium">{st.label}</p>
          </div>
        ))}
      </div>

      {/* Answer rate bar */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-gray-800">Hukuki Soruların Yanıtlanma Durumu</span>
          <span className="text-sm font-semibold text-green-600">%{answerRate}</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${answerRate}%` }} />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {s.answeredQ} yanıtlı / {s.questions - s.answeredQ} bekliyor
        </p>
      </div>

      <div className="card p-6 text-center">
        <p className="text-gray-600 text-sm">
          Tüm veriler gerçek zamanlı olarak platformdan alınmaktadır.
          İstatistikler gizlilik politikamız çerçevesinde anonim tutulmaktadır.
        </p>
      </div>
    </div>
  )
}
