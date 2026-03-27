'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  HiArrowLeft, HiCheckCircle, HiHeart, HiOutlineHeart,
  HiFlag, HiShare, HiCheckBadge, HiEye, HiClock,
  HiLockClosed, HiPaperAirplane,
} from 'react-icons/hi2'

const topic = {
  id: '1',
  title: 'Açık cezaevinde izin hakkı — hangi belgeler gerekiyor?',
  category: 'Aile & Ziyaret',
  author: 'Fatma Y.',
  authorRole: 'aile',
  time: '2 saat önce',
  views: 342,
  content: `Eşim Ankara Sincan Açık Ceza İnfaz Kurumu'nda bulunuyor. 6 aydır açık cezaevinde ve iyi halli. Haftasonu izin hakkını kullanmak istiyoruz ama hangi belgelerin lazım olduğu konusunda net bir bilgi bulamıyoruz.

Cezaevi idaresi "dilekçe ver" diyor ama dilekçeye ek olarak başka belgeler de isteniyor gibi görünüyor. Daha önce bu süreci yaşayan var mı? Belgeler neler, nereye başvuruluyor?`,
  solved: false,
  tags: ['açıkcezaevi', 'izinhakkı', 'belgeler'],
}

const replies = [
  {
    id: '1',
    author: 'Av. Mehmet Yılmaz',
    role: 'avukat',
    verified: true,
    time: '1 saat önce',
    content: `Açık ceza infaz kurumlarında izin hakkı için gerekli belgeler şunlardır:

**1. Dilekçe** — Kuruma hitaben yazılmış, imzalı dilekçe
**2. Nüfus Cüzdanı Fotokopisi** — Hükümlü ve birlikte kalınacak kişinin
**3. İkametgah Belgesi** — Gidilecek adrese ait
**4. Sabıka Kaydı** — Birlikte kalınacak kişinin
**5. Ev/Konut Belgesi** — Tapu veya kira sözleşmesi fotokopisi

Dilekçeyi kurum müdürlüğüne vermeniz gerekiyor. Genellikle 15 iş günü içinde sonuçlandırılır. İlk izin genellikle kısa süreli (3 gün) verilir.`,
    likes: 34,
    isSolution: false,
  },
  {
    id: '2',
    author: 'Ali Kaya',
    role: 'aile',
    verified: false,
    time: '45 dk önce',
    content: `Ben de eşim için geçen ay bu işlemleri yaptım. Av. Mehmet Bey'in dediği belgeler doğru. Ben ek olarak eşimin kendi el yazısıyla yazdığı bir dilekçe de istediler.

Ayrıca birlikte kalacağı kişinin (benim) hükümlüyle akraba olduğumu kanıtlayan nikah cüzdanı fotokopisi de gerekti. Nüfus müdürlüğünden aile tablosu da faydalı olabilir.`,
    likes: 18,
    isSolution: false,
  },
  {
    id: '3',
    author: 'Hukuk Destek Derneği',
    role: 'gonullu',
    verified: true,
    time: '30 dk önce',
    content: `Ek bilgi: Belge listesi kurumdan kuruma küçük farklılıklar gösterebilir. İşlemlere başlamadan önce kurumun sosyal çalışmacısıyla görüşmenizi öneririm. Çoğu açık kurumda haftada belirli günler ücretsiz hukuki danışmanlık da verilmektedir.`,
    likes: 9,
    isSolution: false,
  },
]

const roleColors: Record<string, string> = {
  mahkum: 'bg-orange-100 text-orange-700', aile: 'bg-green-100 text-green-700',
  avukat: 'bg-blue-100 text-blue-700', tahliye: 'bg-teal-100 text-teal-700',
  gonullu: 'bg-purple-100 text-purple-700',
}
const roleLabels: Record<string, string> = {
  mahkum: 'Tutuklu', aile: 'Aile', avukat: 'Avukat', tahliye: 'Tahliye', gonullu: 'Gönüllü',
}

export default function ForumTopicPage() {
  const [replyText, setReplyText] = useState('')
  const [isAnon, setIsAnon] = useState(false)
  const [likes, setLikes] = useState<Record<string, boolean>>({})

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Geri */}
      <Link href="/forum" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-navy-700 mb-4 transition-colors">
        <HiArrowLeft className="w-4 h-4" /> Foruma Dön
      </Link>

      {/* Konu Başlığı */}
      <div className="card p-5 mb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h1 className="text-lg font-bold text-gray-900 leading-snug">{topic.title}</h1>
          {topic.solved && (
            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full flex-shrink-0 font-medium">
              <HiCheckCircle className="w-3.5 h-3.5" /> Çözüldü
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4 text-xs text-gray-400">
          <span className={`px-2 py-0.5 rounded-full font-medium ${roleColors[topic.authorRole]}`}>
            {roleLabels[topic.authorRole]}
          </span>
          <span>{topic.author}</span>
          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{topic.category}</span>
          <span className="flex items-center gap-0.5"><HiClock className="w-3 h-3" /> {topic.time}</span>
          <span className="flex items-center gap-0.5"><HiEye className="w-3 h-3" /> {topic.views}</span>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{topic.content}</p>

        <div className="flex flex-wrap gap-2 mt-3">
          {topic.tags.map(tag => (
            <span key={tag} className="text-xs bg-navy-50 text-navy-700 px-2.5 py-0.5 rounded-full">#{tag}</span>
          ))}
        </div>

        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-50">
          <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-crimson-600 transition-colors">
            <HiShare className="w-4 h-4" /> Paylaş
          </button>
          <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 transition-colors">
            <HiFlag className="w-4 h-4" /> Şikayet
          </button>
        </div>
      </div>

      {/* Yanıtlar */}
      <div className="space-y-3 mb-4">
        <p className="text-sm font-semibold text-gray-600">{replies.length} Yanıt</p>

        {replies.map((reply, i) => (
          <div key={reply.id} className={`card p-5 ${reply.isSolution ? 'border-2 border-green-300 bg-green-50/30' : ''}`}>
            {reply.isSolution && (
              <div className="flex items-center gap-1.5 text-xs text-green-600 font-semibold mb-3">
                <HiCheckCircle className="w-4 h-4" /> En İyi Yanıt
              </div>
            )}

            <div className="flex items-start gap-3 mb-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
                reply.role === 'avukat' ? 'bg-blue-600' :
                reply.role === 'gonullu' ? 'bg-purple-500' : 'bg-green-500'
              }`}>
                {reply.author.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-sm text-gray-900">{reply.author}</span>
                  {reply.verified && <HiCheckBadge className="w-4 h-4 text-blue-500" />}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[reply.role]}`}>
                    {roleLabels[reply.role]}
                  </span>
                  <span className="text-xs text-gray-400">{reply.time}</span>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap pl-12">
              {reply.content}
            </div>

            <div className="flex items-center gap-3 mt-3 pl-12">
              <button
                onClick={() => setLikes(p => ({ ...p, [reply.id]: !p[reply.id] }))}
                className={`flex items-center gap-1 text-xs transition-colors ${likes[reply.id] ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
              >
                {likes[reply.id] ? <HiHeart className="w-4 h-4" /> : <HiOutlineHeart className="w-4 h-4" />}
                {reply.likes + (likes[reply.id] ? 1 : 0)}
              </button>
              <button className="text-xs text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1">
                <HiFlag className="w-3.5 h-3.5" /> Şikayet
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Yanıt Yaz */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-800 mb-3">Yanıt Yaz</h3>
        <textarea
          value={replyText}
          onChange={e => setReplyText(e.target.value)}
          rows={4}
          className="input-field resize-none mb-3"
          placeholder="Yanıtınızı yazın... Lütfen doğru ve yardımcı bilgi paylaşın."
        />
        <div className="flex items-center justify-between flex-wrap gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" checked={isAnon} onChange={e => setIsAnon(e.target.checked)} className="w-4 h-4" />
            <HiLockClosed className="w-3.5 h-3.5" /> Anonim yanıtla
          </label>
          <button
            disabled={!replyText.trim()}
            className="flex items-center gap-2 btn-primary text-sm disabled:opacity-50"
          >
            <HiPaperAirplane className="w-4 h-4" /> Yanıtla
          </button>
        </div>
      </div>
    </div>
  )
}
