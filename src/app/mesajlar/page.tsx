'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  HiMagnifyingGlass, HiPaperAirplane, HiCheckBadge,
  HiArrowLeft, HiLockClosed, HiChatBubbleLeftRight,
} from 'react-icons/hi2'

const roleLabel: Record<string, string> = {
  AVUKAT: 'Avukat', AILE: 'Aile Üyesi', TAHLIYE: 'Tahliye Olmuş',
  MAHKUM: 'Tutuklu/Hükümlü', GONULLU: 'Gönüllü', ADMIN: 'Yönetici',
}
const roleColor: Record<string, string> = {
  AVUKAT: 'text-blue-600', AILE: 'text-green-600', TAHLIYE: 'text-teal-600',
  MAHKUM: 'text-orange-600', GONULLU: 'text-purple-600', ADMIN: 'text-gray-600',
}
const roleBg: Record<string, string> = {
  AVUKAT: 'bg-blue-500', AILE: 'bg-green-500', TAHLIYE: 'bg-teal-500',
  MAHKUM: 'bg-orange-500', GONULLU: 'bg-purple-500', ADMIN: 'bg-gray-500',
}

interface Conv {
  userId: string
  name: string
  username: string
  role: string
  verified: boolean
  lastMessage: string
  lastTime: string
  unread: number
}

interface Msg {
  id: string
  senderId: string
  receiverId: string
  content: string
  read: boolean
  createdAt: string
}

function timeLabel(date: string) {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 86400000 && d.getDate() === now.getDate())
    return d.toLocaleTimeString('tr', { hour: '2-digit', minute: '2-digit' })
  if (diff < 172800000) return 'Dün'
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })
}

export default function MesajlarPage() {
  const { data: session } = useSession()
  const me = (session?.user as any)

  const [convs, setConvs]         = useState<Conv[]>([])
  const [convsLoading, setConvsLoading] = useState(true)
  const [selected, setSelected]   = useState<Conv | null>(null)
  const [msgs, setMsgs]           = useState<Msg[]>([])
  const [msgsLoading, setMsgsLoading] = useState(false)
  const [text, setText]           = useState('')
  const [sending, setSending]     = useState(false)
  const [showList, setShowList]   = useState(true)
  const [search, setSearch]       = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  // Load conversations
  useEffect(() => {
    if (!session) { setConvsLoading(false); return }
    fetch('/api/messages')
      .then(r => r.json())
      .then(data => { setConvs(Array.isArray(data) ? data : []); setConvsLoading(false) })
      .catch(() => setConvsLoading(false))
  }, [session])

  // Load messages when conversation selected
  useEffect(() => {
    if (!selected) return
    setMsgsLoading(true)
    fetch(`/api/messages/${selected.userId}`)
      .then(r => r.json())
      .then(data => { setMsgs(Array.isArray(data) ? data : []); setMsgsLoading(false) })
      .catch(() => setMsgsLoading(false))
  }, [selected])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  const sendMessage = async () => {
    if (!text.trim() || !selected || sending) return
    setSending(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: selected.userId, content: text.trim() }),
      })
      const newMsg = await res.json()
      if (res.ok) {
        setMsgs(prev => [...prev, newMsg])
        setText('')
        // Update conv last message
        setConvs(prev => prev.map(c =>
          c.userId === selected.userId
            ? { ...c, lastMessage: text.trim(), lastTime: new Date().toISOString() }
            : c
        ))
      }
    } catch { /* ignore */ }
    setSending(false)
  }

  const filteredConvs = convs.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(search.toLowerCase())
  )

  if (!session) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-500">
      <HiChatBubbleLeftRight className="w-12 h-12 mx-auto mb-3 opacity-30" />
      <p className="font-medium mb-2">Mesajları görmek için giriş yapın</p>
      <Link href="/giris" className="text-navy-700 font-semibold hover:underline">Giriş Yap</Link>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="card overflow-hidden" style={{ height: 'calc(100vh - 120px)', minHeight: 500 }}>
        <div className="flex h-full">

          {/* Sol — Konuşma Listesi */}
          <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col flex-shrink-0 ${!showList ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 mb-3">Mesajlar</h2>
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
              {convsLoading && (
                <div className="p-4 space-y-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="w-11 h-11 bg-gray-200 rounded-full" />
                      <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                        <div className="h-2.5 bg-gray-100 rounded w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!convsLoading && filteredConvs.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  <HiChatBubbleLeftRight className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Henüz mesajınız yok</p>
                </div>
              )}
              {filteredConvs.map(conv => (
                <button key={conv.userId}
                  onClick={() => { setSelected(conv); setShowList(false) }}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all text-left ${selected?.userId === conv.userId ? 'bg-navy-50 border-r-2 border-navy-700' : ''}`}
                >
                  <div className={`w-11 h-11 ${roleBg[conv.role] || 'bg-gray-400'} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {conv.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-gray-900 truncate">{conv.name}</span>
                        {conv.verified && <HiCheckBadge className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />}
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">{timeLabel(conv.lastTime)}</span>
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
            {!selected ? (
              <div className="flex-1 flex items-center justify-center text-center text-gray-400">
                <div>
                  <HiChatBubbleLeftRight className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Bir konuşma seçin</p>
                </div>
              </div>
            ) : (
              <>
                {/* Üst Bar */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
                  <button onClick={() => setShowList(true)} className="md:hidden p-2 text-gray-400 hover:text-gray-600 rounded-xl">
                    <HiArrowLeft className="w-5 h-5" />
                  </button>
                  <div className={`w-10 h-10 ${roleBg[selected.role] || 'bg-gray-400'} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                    {selected.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Link href={`/profil/${selected.username}`} className="font-semibold text-gray-900 text-sm hover:underline">
                        {selected.name}
                      </Link>
                      {selected.verified && <HiCheckBadge className="w-4 h-4 text-blue-500" />}
                      <span className={`text-xs font-medium ${roleColor[selected.role] || 'text-gray-600'}`}>
                        {roleLabel[selected.role] || selected.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mesajlar */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  <div className="flex items-center justify-center">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-white px-3 py-1.5 rounded-full border border-gray-100">
                      <HiLockClosed className="w-3 h-3" /> Mesajlar uçtan uca şifrelidir
                    </div>
                  </div>

                  {msgsLoading && (
                    <div className="space-y-3 py-4">
                      {[1,2,3].map(i => (
                        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                          <div className="h-10 bg-gray-200 rounded-2xl w-48 animate-pulse" />
                        </div>
                      ))}
                    </div>
                  )}

                  {!msgsLoading && msgs.map(msg => {
                    const isMe = msg.senderId === me?.id
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isMe
                            ? 'bg-navy-700 text-white rounded-br-sm'
                            : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                        }`}>
                          {msg.content}
                          <div className={`flex items-center justify-end gap-1 mt-1 ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                            <span className="text-xs">
                              {new Date(msg.createdAt).toLocaleTimeString('tr', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isMe && <span className="text-xs">{msg.read ? '✓✓' : '✓'}</span>}
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {!msgsLoading && msgs.length === 0 && (
                    <div className="text-center text-gray-400 py-8 text-sm">
                      Henüz mesaj yok. İlk mesajı siz gönderin!
                    </div>
                  )}

                  <div ref={bottomRef} />
                </div>

                {/* Mesaj Gönder */}
                <div className="p-3 bg-white border-t border-gray-100">
                  <div className="flex items-end gap-2">
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
                      disabled={!text.trim() || sending}
                      className="p-2.5 bg-navy-700 hover:bg-navy-800 disabled:bg-gray-200 text-white rounded-xl transition-all flex-shrink-0"
                    >
                      <HiPaperAirplane className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
