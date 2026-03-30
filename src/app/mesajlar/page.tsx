'use client'

import { useState, useRef, useEffect } from 'react'
import {
  HiMagnifyingGlass, HiPaperAirplane, HiPaperClip,
  HiEllipsisVertical, HiCheckBadge, HiPhone, HiVideoCamera,
  HiArrowLeft, HiLockClosed, HiPlus,
} from 'react-icons/hi2'

type Message = {
  id: string
  text: string
  sender: 'me' | 'other'
  time: string
  read: boolean
}

type Conversation = {
  id: string
  name: string
  role: string
  roleColor: string
  avatar: string
  avatarBg: string
  lastMessage: string
  lastTime: string
  unread: number
  online: boolean
  verified: boolean
  messages: Message[]
}

const conversations: Conversation[] = [
  {
    id: '1',
    name: 'Av. Mehmet Yılmaz',
    role: 'Avukat',
    roleColor: 'text-blue-600',
    avatar: 'MY',
    avatarBg: 'bg-blue-600',
    lastMessage: 'İnfaz indirimini hesapladım, detayları gönderdim.',
    lastTime: '10:24',
    unread: 2,
    online: true,
    verified: true,
    messages: [
      { id: '1', text: 'Merhaba, denetimli serbestlik başvurusu hakkında bilgi alabilir miyim?', sender: 'me', time: '10:10', read: true },
      { id: '2', text: 'Merhaba, tabii ki. Ne kadar ceza aldı ve ne kadarını çekti?', sender: 'other', time: '10:12', read: true },
      { id: '3', text: '4 yıl aldı, 2 yılı geçti. İyi halli olarak devam ediyor.', sender: 'me', time: '10:15', read: true },
      { id: '4', text: 'Bu durumda denetimli serbestlik için henüz erken. 3. yılı tamamladıktan sonra başvurabilir. İnfaz indirimini hesapladım, detayları gönderdim.', sender: 'other', time: '10:24', read: false },
    ],
  },
  {
    id: '2',
    name: 'Fatma Yıldız',
    role: 'Aile Üyesi',
    roleColor: 'text-green-600',
    avatar: 'FY',
    avatarBg: 'bg-green-500',
    lastMessage: 'Peki, çok teşekkür ederim 🙏',
    lastTime: 'Dün',
    unread: 0,
    online: false,
    verified: false,
    messages: [
      { id: '1', text: 'Açık cezaevi izin belgelerini biliyor musunuz?', sender: 'other', time: 'Dün 14:30', read: true },
      { id: '2', text: 'Evet, müdürlüğe dilekçe + nüfus cüzdanı fotokopisi + ikametgah belgesi lazım.', sender: 'me', time: 'Dün 14:45', read: true },
      { id: '3', text: 'Peki, çok teşekkür ederim 🙏', sender: 'other', time: 'Dün 15:00', read: true },
    ],
  },
  {
    id: '3',
    name: 'Ahmet Kaya',
    role: 'Tahliye Olmuş',
    roleColor: 'text-teal-600',
    avatar: 'AK',
    avatarBg: 'bg-teal-500',
    lastMessage: 'Workshopa katılmak istiyorum.',
    lastTime: 'Pzt',
    unread: 1,
    online: true,
    verified: false,
    messages: [
      { id: '1', text: 'Merhaba, Ankara\'daki workshopa katılmak istiyorum.', sender: 'other', time: 'Pzt 09:00', read: false },
    ],
  },
  {
    id: '4',
    name: 'Hukuk Destek Derneği',
    role: 'Kurum',
    roleColor: 'text-purple-600',
    avatar: 'HD',
    avatarBg: 'bg-purple-500',
    lastMessage: 'Başvurunuz incelemeye alındı.',
    lastTime: '15.03',
    unread: 0,
    online: false,
    verified: true,
    messages: [
      { id: '1', text: 'Ücretsiz hukuki destek için başvurdum.', sender: 'me', time: '15.03 10:00', read: true },
      { id: '2', text: 'Başvurunuz incelemeye alındı. 3 iş günü içinde dönüş yapacağız.', sender: 'other', time: '15.03 11:30', read: true },
    ],
  },
]

export default function MesajlarPage() {
  const [selected, setSelected] = useState<Conversation>(conversations[0])
  const [text, setText] = useState('')
  const [msgs, setMsgs] = useState<Record<string, Message[]>>(
    Object.fromEntries(conversations.map(c => [c.id, c.messages]))
  )
  const [showList, setShowList] = useState(true)
  const [search, setSearch] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const filteredConvs = conversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, selected])

  const sendMessage = () => {
    if (!text.trim()) return
    const newMsg: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'me',
      time: new Date().toLocaleTimeString('tr', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    }
    setMsgs(prev => ({ ...prev, [selected.id]: [...(prev[selected.id] || []), newMsg] }))
    setText('')
  }

  const currentMsgs = msgs[selected.id] || []

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="card overflow-hidden" style={{ height: 'calc(100vh - 120px)', minHeight: 500 }}>
        <div className="flex h-full">

          {/* Sol — Konuşma Listesi */}
          <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col flex-shrink-0 ${!showList ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-gray-900">Mesajlar</h2>
                <button
                  onClick={() => alert('Yeni mesaj özelliği yakında eklenecek.')}
                  className="p-2 bg-navy-700 text-white rounded-xl hover:bg-navy-800 transition-colors"
                >
                  <HiPlus className="w-4 h-4" />
                </button>
              </div>
              <div className="relative">
                <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-700"
                  placeholder="Mesajlarda ara..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConvs.map(conv => (
                <button key={conv.id} onClick={() => { setSelected(conv); setShowList(false) }}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all text-left ${selected.id === conv.id ? 'bg-navy-50 border-r-2 border-navy-700' : ''}`}
                >
                  <div className="relative flex-shrink-0">
                    <div className={`w-11 h-11 ${conv.avatarBg} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                      {conv.avatar}
                    </div>
                    {conv.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-gray-900 truncate">{conv.name}</span>
                        {conv.verified && <HiCheckBadge className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />}
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">{conv.lastTime}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs text-gray-500 truncate">{conv.lastMessage}</span>
                      {conv.unread > 0 && (
                        <span className="w-5 h-5 bg-navy-700 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sağ — Mesaj Alanı */}
          <div className={`flex-1 flex flex-col min-w-0 ${showList ? 'hidden md:flex' : 'flex'}`}>
            {/* Üst Bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
              <button onClick={() => setShowList(true)} className="md:hidden p-2 text-gray-400 hover:text-gray-600 rounded-xl">
                <HiArrowLeft className="w-5 h-5" />
              </button>
              <div className="relative">
                <div className={`w-10 h-10 ${selected.avatarBg} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                  {selected.avatar}
                </div>
                {selected.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-gray-900 text-sm">{selected.name}</span>
                  {selected.verified && <HiCheckBadge className="w-4 h-4 text-blue-500" />}
                  <span className={`text-xs font-medium ${selected.roleColor}`}>{selected.role}</span>
                </div>
                <p className="text-xs text-gray-400">{selected.online ? '● Çevrimiçi' : 'Son görülme: bilinmiyor'}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => alert('Sesli arama özelliği yakında eklenecek.')}
                  className="p-2 text-gray-400 hover:text-navy-700 hover:bg-gray-100 rounded-xl transition-all"
                  title="Sesli Ara"
                >
                  <HiPhone className="w-5 h-5" />
                </button>
                <button
                  onClick={() => alert('Görüntülü arama özelliği yakında eklenecek.')}
                  className="p-2 text-gray-400 hover:text-navy-700 hover:bg-gray-100 rounded-xl transition-all"
                  title="Görüntülü Ara"
                >
                  <HiVideoCamera className="w-5 h-5" />
                </button>
                <button
                  onClick={() => alert('Daha fazla seçenek yakında eklenecek.')}
                  className="p-2 text-gray-400 hover:text-navy-700 hover:bg-gray-100 rounded-xl transition-all"
                  title="Seçenekler"
                >
                  <HiEllipsisVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mesajlar */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {/* Şifreleme notu */}
              <div className="flex items-center gap-2 justify-center">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-white px-3 py-1.5 rounded-full border border-gray-100">
                  <HiLockClosed className="w-3 h-3" /> Mesajlar uçtan uca şifrelidir
                </div>
              </div>

              {currentMsgs.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'me'
                      ? 'bg-navy-700 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                  }`}>
                    {msg.text}
                    <div className={`flex items-center justify-end gap-1 mt-1 ${msg.sender === 'me' ? 'text-blue-200' : 'text-gray-400'}`}>
                      <span className="text-xs">{msg.time}</span>
                      {msg.sender === 'me' && <span className="text-xs">{msg.read ? '✓✓' : '✓'}</span>}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Mesaj Gönder */}
            <div className="p-3 bg-white border-t border-gray-100">
              <div className="flex items-end gap-2">
                <button
                  onClick={() => alert('Dosya ekleme özelliği yakında eklenecek.')}
                  className="p-2.5 text-gray-400 hover:text-navy-700 hover:bg-gray-100 rounded-xl transition-all flex-shrink-0"
                  title="Dosya Ekle"
                >
                  <HiPaperClip className="w-5 h-5" />
                </button>
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                  placeholder="Mesajınızı yazın..."
                  rows={1}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-700 resize-none"
                  style={{ maxHeight: 120 }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!text.trim()}
                  className="p-2.5 bg-navy-700 hover:bg-navy-800 disabled:bg-gray-200 text-white rounded-xl transition-all flex-shrink-0"
                >
                  <HiPaperAirplane className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
