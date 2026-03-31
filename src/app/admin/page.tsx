'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  HiUsers, HiChatBubbleLeftRight, HiScale, HiNewspaper,
  HiFlag, HiCheckCircle, HiXCircle, HiTrash,
  HiShieldCheck, HiChartBar, HiBell, HiMegaphone,
  HiPlus, HiNoSymbol, HiArrowPath, HiArrowTopRightOnSquare,
} from 'react-icons/hi2'

const roleColors: Record<string, string> = {
  AVUKAT:  'bg-blue-100 text-blue-700',
  AILE:    'bg-green-100 text-green-700',
  TAHLIYE: 'bg-teal-100 text-teal-700',
  MAHKUM:  'bg-orange-100 text-orange-700',
  GONULLU: 'bg-purple-100 text-purple-700',
  ADMIN:   'bg-gray-100 text-gray-700',
}
const roleLabel: Record<string, string> = {
  AVUKAT: 'Avukat', AILE: 'Aile', TAHLIYE: 'Tahliye',
  MAHKUM: 'Mahkum', GONULLU: 'Gönüllü', ADMIN: 'Admin',
}

const TABS = ['Genel Bakış', 'Kullanıcılar', 'İçerik', 'Şikayetler', 'Avukat Onayı', 'Duyurular']

const ANN_COLORS = [
  { label: 'Altın',  value: 'bg-gold-500 text-navy-800' },
  { label: 'Yeşil',  value: 'bg-green-600 text-white' },
  { label: 'Kırmızı', value: 'bg-red-600 text-white' },
  { label: 'Lacivert', value: 'bg-navy-700 text-white' },
  { label: 'Mor',    value: 'bg-purple-600 text-white' },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('Genel Bakış')

  // ── Stats ──────────────────────────────────────────────
  const [stats, setStats] = useState<any>(null)

  // ── Users ──────────────────────────────────────────────
  const [users, setUsers]           = useState<any[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [userSearch, setUserSearch] = useState('')
  const [userRole,   setUserRole]   = useState('')

  // ── Content ────────────────────────────────────────────
  const [contentType,    setContentType]    = useState<'posts'|'topics'>('posts')
  const [posts,          setPosts]          = useState<any[]>([])
  const [topics,         setTopics]         = useState<any[]>([])
  const [contentLoading, setContentLoading] = useState(false)

  // ── Reports ────────────────────────────────────────────
  const [reports,        setReports]        = useState<any[]>([])
  const [reportLoading,  setReportLoading]  = useState<string | null>(null)
  const [reportsLoading, setReportsLoading] = useState(false)

  // ── Lawyers ────────────────────────────────────────────
  const [lawyers,       setLawyers]       = useState<any[]>([])
  const [lawyerLoading, setLawyerLoading] = useState<string | null>(null)
  const [lawyersLoading, setLawyersLoading] = useState(false)

  // ── Announcements ──────────────────────────────────────
  const [anns,       setAnns]       = useState<any[]>([])
  const [annsLoading, setAnnsLoading] = useState(false)
  const [newAnn, setNewAnn] = useState({
    text: '', link: '', linkText: '', color: 'bg-gold-500 text-navy-800',
  })
  const [annSaving, setAnnSaving] = useState(false)

  // ── DS Reminder ────────────────────────────────────────
  const [dsResult, setDsResult]   = useState<string | null>(null)
  const [dsTrigger, setDsTrigger] = useState(false)

  // ── Fetch stats ────────────────────────────────────────
  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json()).then(setStats).catch(() => {})
  }, [])

  // ── Tab lazy fetch ─────────────────────────────────────
  useEffect(() => {
    if (activeTab === 'Kullanıcılar') {
      loadUsers()
    }
    if (activeTab === 'Şikayetler') {
      setReportsLoading(true)
      fetch('/api/admin/reports')
        .then(r => r.json())
        .then(d => { setReports(Array.isArray(d) ? d : []); setReportsLoading(false) })
        .catch(() => setReportsLoading(false))
    }
    if (activeTab === 'Avukat Onayı') {
      setLawyersLoading(true)
      fetch('/api/admin/lawyers')
        .then(r => r.json())
        .then(d => { setLawyers(Array.isArray(d) ? d : []); setLawyersLoading(false) })
        .catch(() => setLawyersLoading(false))
    }
    if (activeTab === 'İçerik') {
      loadContent('posts')
    }
    if (activeTab === 'Duyurular') {
      loadAnns()
    }
  }, [activeTab])

  function loadUsers(role?: string) {
    setUsersLoading(true)
    const params = new URLSearchParams()
    if (role) params.set('role', role)
    fetch(`/api/admin/users?${params}`)
      .then(r => r.json())
      .then(d => { setUsers(Array.isArray(d) ? d : []); setUsersLoading(false) })
      .catch(() => setUsersLoading(false))
  }

  function loadContent(type: 'posts' | 'topics') {
    setContentType(type)
    setContentLoading(true)
    fetch(`/api/admin/content?type=${type}`)
      .then(r => r.json())
      .then(d => {
        if (type === 'posts') setPosts(Array.isArray(d) ? d : [])
        else setTopics(Array.isArray(d) ? d : [])
        setContentLoading(false)
      })
      .catch(() => setContentLoading(false))
  }

  function loadAnns() {
    setAnnsLoading(true)
    fetch('/api/admin/announcements')
      .then(r => r.json())
      .then(d => { setAnns(Array.isArray(d) ? d : []); setAnnsLoading(false) })
      .catch(() => setAnnsLoading(false))
  }

  const handleReport = async (reportId: string, action: 'RESOLVED' | 'DISMISSED') => {
    setReportLoading(reportId)
    try {
      await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, action }),
      })
      setReports(prev => prev.filter(r => r.id !== reportId))
    } catch { /* ignore */ }
    setReportLoading(null)
  }

  const handleLawyer = async (userId: string, action: 'approve' | 'reject') => {
    setLawyerLoading(userId)
    try {
      await fetch('/api/admin/lawyers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      })
      setLawyers(prev => prev.filter(l => l.id !== userId))
    } catch { /* ignore */ }
    setLawyerLoading(null)
  }

  const handleUserAction = async (userId: string, action: string) => {
    try {
      await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      })
      setUsers(prev => prev.map(u =>
        u.id === userId ? {
          ...u,
          status: action === 'ban' ? 'BANNED'
                : action === 'unban' ? 'ACTIVE'
                : action === 'suspend' ? 'SUSPENDED'
                : action === 'verify' ? 'ACTIVE'
                : u.status,
          verified: action === 'verify' ? true : u.verified,
        } : u
      ))
    } catch { /* ignore */ }
  }

  const handleDeleteContent = async (id: string, type: 'post' | 'topic') => {
    if (!confirm('Bu içeriği silmek istediğinize emin misiniz?')) return
    try {
      await fetch('/api/admin/content', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type }),
      })
      if (type === 'post') setPosts(p => p.filter(x => x.id !== id))
      else setTopics(t => t.filter(x => x.id !== id))
    } catch { /* ignore */ }
  }

  const handlePinPost = async (id: string, isPinned: boolean) => {
    try {
      await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isPinned }),
      })
      setPosts(p => p.map(x => x.id === id ? { ...x, isPinned } : x))
    } catch { /* ignore */ }
  }

  const handleCreateAnn = async () => {
    if (!newAnn.text.trim()) return
    setAnnSaving(true)
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnn),
      })
      const data = await res.json()
      setAnns(p => [data, ...p])
      setNewAnn({ text: '', link: '', linkText: '', color: 'bg-gold-500 text-navy-800' })
    } catch { /* ignore */ }
    setAnnSaving(false)
  }

  const handleToggleAnn = async (id: string, active: boolean) => {
    try {
      await fetch('/api/admin/announcements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active }),
      })
      setAnns(p => p.map(a => a.id === id ? { ...a, active } : a))
    } catch { /* ignore */ }
  }

  const handleDeleteAnn = async (id: string) => {
    if (!confirm('Duyuruyu silmek istediğinize emin misiniz?')) return
    try {
      await fetch('/api/admin/announcements', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      setAnns(p => p.filter(a => a.id !== id))
    } catch { /* ignore */ }
  }

  const triggerDsReminder = async () => {
    setDsTrigger(true)
    setDsResult(null)
    try {
      const res = await fetch('/api/ds-reminder', { method: 'POST' })
      const d = await res.json()
      setDsResult(`✅ Tamamlandı: ${d.sent} email gönderildi, ${d.checked} takvim kontrol edildi.`)
    } catch {
      setDsResult('❌ Hata oluştu')
    }
    setDsTrigger(false)
  }

  const filteredUsers = users.filter(u => {
    const q = userSearch.toLowerCase()
    return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.username?.toLowerCase().includes(q)
  })

  const statCards = stats ? [
    { label: 'Toplam Üye',       value: stats.users.total,           sub: `${stats.users.active} aktif`,     color: 'bg-blue-500',   icon: HiUsers               },
    { label: 'Gönderi + Forum',  value: stats.content.posts + stats.content.topics, sub: `${stats.content.posts} gönderi, ${stats.content.topics} konu`, color: 'bg-green-500', icon: HiChatBubbleLeftRight },
    { label: 'Bekleyen Şikayet', value: stats.moderation.pendingReports, sub: 'Moderasyon bekliyor', color: 'bg-red-500',    icon: HiFlag                },
    { label: 'Hukuki Sorular',   value: `${stats.legal.answered}/${stats.legal.total}`, sub: 'yanıtlandı', color: 'bg-orange-500', icon: HiScale               },
  ] : []

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Başlık */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <HiShieldCheck className="w-7 h-7 text-navy-700" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Paneli</h1>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">Cezaevinden.com yönetim merkezi</p>
        </div>
        <span className="text-sm bg-green-100 text-green-700 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 bg-green-500 rounded-full inline-block" /> Sistem Aktif
        </span>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab ? 'bg-navy-700 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* ── GENEL BAKIŞ ── */}
      {activeTab === 'Genel Bakış' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {!stats && [1,2,3,4].map(i => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="h-10 w-10 bg-gray-200 rounded-xl mb-3" />
                <div className="h-7 bg-gray-200 rounded w-1/2 mb-1" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
              </div>
            ))}
            {statCards.map(({ label, value, sub, icon: Icon, color }) => (
              <div key={label} className="card p-5">
                <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Hızlı İşlemler */}
            <div className="card p-5">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <HiChartBar className="w-5 h-5 text-gray-400" /> Hızlı İşlemler
              </h2>
              <div className="space-y-2">
                {[
                  { label: 'Bekleyen avukat başvuruları', count: stats?.users.pendingLawyers ?? '…', color: 'text-blue-600', tab: 'Avukat Onayı' },
                  { label: 'İncelenmesi gereken şikayetler', count: stats?.moderation.pendingReports ?? '…', color: 'text-red-600', tab: 'Şikayetler' },
                  { label: 'Kullanıcı yönetimi', count: stats?.users.total ?? '…', color: 'text-green-600', tab: 'Kullanıcılar' },
                  { label: 'Duyuruları yönet', count: '→', color: 'text-orange-600', tab: 'Duyurular' },
                ].map(({ label, count, color, tab }) => (
                  <button key={label} onClick={() => setActiveTab(tab)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all text-left border border-gray-100">
                    <span className="text-sm text-gray-700">{label}</span>
                    <span className={`font-bold text-sm ${color}`}>{count}</span>
                  </button>
                ))}
                <Link href="/admin/haberler"
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all text-left border border-gray-100">
                  <span className="text-sm text-gray-700">Haber yönetimi</span>
                  <span className="font-bold text-sm text-gray-400 flex items-center gap-1">
                    <HiArrowTopRightOnSquare className="w-4 h-4" />
                  </span>
                </Link>
              </div>
            </div>

            {/* DS Hatırlatma */}
            <div className="card p-5">
              <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <HiBell className="w-5 h-5 text-gray-400" /> DS Hatırlatma — Manuel Tetikle
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Cron job saatlik çalışır. Test etmek veya hemen göndermek için aşağıdan tetikleyebilirsiniz.
              </p>
              {dsResult && (
                <p className="text-sm font-medium mb-3 p-2 bg-gray-50 rounded-lg">{dsResult}</p>
              )}
              <button
                onClick={triggerDsReminder}
                disabled={dsTrigger}
                className="btn-primary flex items-center gap-2 disabled:opacity-60"
              >
                <HiArrowPath className={`w-4 h-4 ${dsTrigger ? 'animate-spin' : ''}`} />
                {dsTrigger ? 'Gönderiliyor...' : 'Şimdi Çalıştır'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── KULLANICILAR ── */}
      {activeTab === 'Kullanıcılar' && (
        <div className="space-y-4">
          {/* Filtreler */}
          <div className="card p-4 flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="İsim, email veya kullanıcı adı ara..."
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              className="input-field flex-1 min-w-[200px]"
            />
            <select
              value={userRole}
              onChange={e => { setUserRole(e.target.value); loadUsers(e.target.value || undefined) }}
              className="input-field w-40"
            >
              <option value="">Tüm Roller</option>
              {Object.entries(roleLabel).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          <div className="card overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-800">Kullanıcı Yönetimi</h2>
              <span className="text-sm text-gray-500">{filteredUsers.length} kullanıcı</span>
            </div>
            {usersLoading && <div className="p-8 text-center text-gray-400">Yükleniyor...</div>}
            <div className="divide-y divide-gray-50">
              {filteredUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-9 h-9 bg-navy-700 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                    {u.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{u.name}</p>
                    <p className="text-xs text-gray-400 truncate">{u.email}</p>
                    <p className="text-xs text-gray-300">{u._count?.posts || 0} gönderi · {u._count?.followers || 0} takipçi</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${roleColors[u.role] || 'bg-gray-100 text-gray-700'}`}>
                    {roleLabel[u.role] || u.role}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    u.status === 'ACTIVE' ? 'bg-green-100 text-green-600' :
                    u.status === 'PENDING' ? 'bg-yellow-100 text-yellow-600' :
                    u.status === 'BANNED' ? 'bg-red-100 text-red-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {u.status === 'ACTIVE' ? 'Aktif' : u.status === 'PENDING' ? 'Beklemede' : u.status === 'BANNED' ? 'Banlı' : 'Askıda'}
                  </span>
                  <div className="flex gap-1 flex-shrink-0">
                    {u.status === 'ACTIVE' && (
                      <>
                        <button onClick={() => { if (confirm(`${u.name} askıya alınsın mı?`)) handleUserAction(u.id, 'suspend') }}
                          title="Askıya Al" className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
                          <HiXCircle className="w-4 h-4" />
                        </button>
                        <button onClick={() => { if (confirm(`${u.name} banlansın mı?`)) handleUserAction(u.id, 'ban') }}
                          title="Banla" className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <HiNoSymbol className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {(u.status === 'SUSPENDED' || u.status === 'BANNED') && (
                      <button onClick={() => handleUserAction(u.id, 'unban')}
                        title="Aktif Et" className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                        <HiCheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {u.role === 'AVUKAT' && !u.verified && (
                      <button onClick={() => handleUserAction(u.id, 'verify')}
                        title="Avukat Doğrula" className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <HiShieldCheck className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {!usersLoading && filteredUsers.length === 0 && (
                <div className="p-8 text-center text-gray-400">Kullanıcı bulunamadı.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── İÇERİK ── */}
      {activeTab === 'İçerik' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            {(['posts', 'topics'] as const).map(t => (
              <button key={t} onClick={() => loadContent(t)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  contentType === t ? 'bg-navy-700 text-white border-navy-700' : 'bg-white text-gray-600 border-gray-200'
                }`}>
                {t === 'posts' ? 'Gönderiler' : 'Forum Konuları'}
              </button>
            ))}
          </div>

          <div className="card overflow-hidden">
            {contentLoading && <div className="p-8 text-center text-gray-400">Yükleniyor...</div>}
            <div className="divide-y divide-gray-50">
              {contentType === 'posts' && posts.map(p => (
                <div key={p.id} className="flex items-start gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 line-clamp-2">{p.content}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      @{p.author?.username} · {p.category}
                      {p.isPinned && <span className="ml-2 text-gold-600 font-medium">📌 Sabitlenmiş</span>}
                      {' · '}{p._count?.likes || 0} ❤ · {p._count?.comments || 0} 💬
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => handlePinPost(p.id, !p.isPinned)}
                      title={p.isPinned ? 'Sabitlemeyi Kaldır' : 'Sabitle'}
                      className="p-1.5 text-gray-400 hover:text-gold-600 hover:bg-yellow-50 rounded-lg transition-all text-xs"
                    >
                      📌
                    </button>
                    <button
                      onClick={() => handleDeleteContent(p.id, 'post')}
                      title="Sil"
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {contentType === 'topics' && topics.map(t => (
                <div key={t.id} className="flex items-start gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 line-clamp-1">{t.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      @{t.author?.username} · {t.category} · {t._count?.replies || 0} yanıt
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteContent(t.id, 'topic')}
                    title="Sil"
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {!contentLoading && contentType === 'posts' && posts.length === 0 && (
                <div className="p-8 text-center text-gray-400">Gönderi yok.</div>
              )}
              {!contentLoading && contentType === 'topics' && topics.length === 0 && (
                <div className="p-8 text-center text-gray-400">Forum konusu yok.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── ŞİKAYETLER ── */}
      {activeTab === 'Şikayetler' && (
        <div className="space-y-3">
          {reportsLoading && <div className="card p-8 text-center text-gray-400">Yükleniyor...</div>}
          {!reportsLoading && reports.length === 0 && (
            <div className="card p-8 text-center text-gray-400">
              <HiCheckCircle className="w-10 h-10 mx-auto mb-2 text-green-400" />
              <p className="font-medium">Bekleyen şikayet yok</p>
            </div>
          )}
          {reports.map(report => (
            <div key={report.id} className="card p-5">
              <div className="mb-3">
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium mb-2 inline-block">
                  {report.reason}
                </span>
                <p className="text-sm text-gray-700 line-clamp-2">{report.post?.content || 'İçerik silinmiş'}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Şikayet eden: @{report.reporter?.username} → @{report.reportedUser?.username || '?'}
                </p>
              </div>
              <div className="flex gap-2 pt-3 border-t border-gray-50">
                <button onClick={() => handleReport(report.id, 'RESOLVED')} disabled={reportLoading === report.id}
                  className="flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50 rounded-xl text-sm font-medium transition-all">
                  <HiCheckCircle className="w-4 h-4" /> {reportLoading === report.id ? '...' : 'İçeriği Kaldır'}
                </button>
                <button onClick={() => handleReport(report.id, 'DISMISSED')} disabled={reportLoading === report.id}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-50 rounded-xl text-sm font-medium transition-all">
                  <HiXCircle className="w-4 h-4" /> {reportLoading === report.id ? '...' : 'Reddet'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── AVUKAT ONAYI ── */}
      {activeTab === 'Avukat Onayı' && (
        <div className="space-y-3">
          {lawyersLoading && <div className="card p-8 text-center text-gray-400">Yükleniyor...</div>}
          {!lawyersLoading && lawyers.length === 0 && (
            <div className="card p-8 text-center text-gray-400">
              <HiCheckCircle className="w-10 h-10 mx-auto mb-2 text-green-400" />
              <p className="font-medium">Onay bekleyen avukat başvurusu yok</p>
            </div>
          )}
          {lawyers.map(u => (
            <div key={u.id} className="card p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {u.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{u.name}</p>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">avukat</span>
                  </div>
                  <p className="text-xs text-gray-500">{u.email}</p>
                  {u.baroNo && <p className="text-xs text-gray-400">Baro No: {u.baroNo}</p>}
                  <p className="text-xs text-gray-400">{u._count?.answers || 0} yanıt</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleLawyer(u.id, 'approve')} disabled={lawyerLoading === u.id}
                  className="flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50 rounded-xl text-sm font-medium transition-all">
                  <HiCheckCircle className="w-4 h-4" /> {lawyerLoading === u.id ? '...' : 'Onayla'}
                </button>
                <button onClick={() => handleLawyer(u.id, 'reject')} disabled={lawyerLoading === u.id}
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50 rounded-xl text-sm font-medium transition-all">
                  <HiXCircle className="w-4 h-4" /> {lawyerLoading === u.id ? '...' : 'Reddet'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── DUYURULAR ── */}
      {activeTab === 'Duyurular' && (
        <div className="space-y-4">
          {/* Yeni duyuru formu */}
          <div className="card p-5 space-y-4">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <HiMegaphone className="w-5 h-5 text-gray-400" /> Yeni Duyuru
            </h2>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Duyuru Metni *</label>
              <input type="text" className="input-field"
                placeholder="Duyuru metnini girin..."
                value={newAnn.text}
                onChange={e => setNewAnn(p => ({ ...p, text: e.target.value }))}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Bağlantı URL (opsiyonel)</label>
                <input type="text" className="input-field"
                  placeholder="/hukuki-yardim"
                  value={newAnn.link}
                  onChange={e => setNewAnn(p => ({ ...p, link: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Bağlantı Metni</label>
                <input type="text" className="input-field"
                  placeholder="Hukuki Yardım"
                  value={newAnn.linkText}
                  onChange={e => setNewAnn(p => ({ ...p, linkText: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-2">Renk</label>
              <div className="flex flex-wrap gap-2">
                {ANN_COLORS.map(c => (
                  <button key={c.value} onClick={() => setNewAnn(p => ({ ...p, color: c.value }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border-2 transition-all ${c.value} ${
                      newAnn.color === c.value ? 'border-gray-900 scale-105' : 'border-transparent'
                    }`}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Önizleme */}
            {newAnn.text && (
              <div className={`${newAnn.color} text-sm py-2 px-4 rounded-lg flex items-center gap-2`}>
                <HiMegaphone className="w-4 h-4" />
                <span>{newAnn.text}{newAnn.linkText && <strong className="ml-1 underline">{newAnn.linkText}</strong>}</span>
              </div>
            )}
            <button onClick={handleCreateAnn} disabled={annSaving || !newAnn.text.trim()}
              className="btn-primary flex items-center gap-2 disabled:opacity-60">
              <HiPlus className="w-4 h-4" /> {annSaving ? 'Ekleniyor...' : 'Duyuruyu Yayınla'}
            </button>
          </div>

          {/* Mevcut duyurular */}
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">Mevcut Duyurular</h2>
            </div>
            {annsLoading && <div className="p-8 text-center text-gray-400">Yükleniyor...</div>}
            {!annsLoading && anns.length === 0 && (
              <div className="p-8 text-center text-gray-400">Henüz duyuru yok.</div>
            )}
            <div className="divide-y divide-gray-50">
              {anns.map(a => (
                <div key={a.id} className="flex items-center gap-3 px-4 py-3">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${a.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">{a.text}</p>
                    {a.link && <p className="text-xs text-gray-400 truncate">→ {a.link}</p>}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    a.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {a.active ? 'Yayında' : 'Pasif'}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => handleToggleAnn(a.id, !a.active)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title={a.active ? 'Yayından Kaldır' : 'Yayına Al'}>
                      {a.active ? <HiXCircle className="w-4 h-4" /> : <HiCheckCircle className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleDeleteAnn(a.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Sil">
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
