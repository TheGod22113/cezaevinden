'use client'

import { useState, useEffect } from 'react'
import {
  HiUsers, HiChatBubbleLeftRight, HiScale, HiNewspaper,
  HiFlag, HiCheckCircle, HiXCircle, HiEye, HiTrash,
  HiShieldCheck, HiArrowTrendingUp, HiClock, HiBell,
  HiUserPlus, HiChartBar,
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

const tabs = ['Genel Bakış', 'Kullanıcılar', 'Şikayetler', 'Avukat Onayı']

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('Genel Bakış')

  // Stats
  const [stats, setStats] = useState<any>(null)

  // Users
  const [users, setUsers]         = useState<any[]>([])
  const [usersLoading, setUsersLoading] = useState(false)

  // Reports
  const [reports, setReports]           = useState<any[]>([])
  const [reportLoading, setReportLoading] = useState<string | null>(null)
  const [reportsLoading, setReportsLoading] = useState(false)

  // Lawyers
  const [lawyers, setLawyers]           = useState<any[]>([])
  const [lawyerLoading, setLawyerLoading] = useState<string | null>(null)
  const [lawyersLoading, setLawyersLoading] = useState(false)

  // Fetch stats on mount
  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(() => {})
  }, [])

  // Fetch tab data lazily
  useEffect(() => {
    if (activeTab === 'Kullanıcılar' && users.length === 0) {
      setUsersLoading(true)
      fetch('/api/admin/users')
        .then(r => r.json())
        .then(data => { setUsers(Array.isArray(data) ? data : []); setUsersLoading(false) })
        .catch(() => setUsersLoading(false))
    }
    if (activeTab === 'Şikayetler') {
      setReportsLoading(true)
      fetch('/api/admin/reports')
        .then(r => r.json())
        .then(data => { setReports(Array.isArray(data) ? data : []); setReportsLoading(false) })
        .catch(() => setReportsLoading(false))
    }
    if (activeTab === 'Avukat Onayı' && lawyers.length === 0) {
      setLawyersLoading(true)
      fetch('/api/admin/lawyers')
        .then(r => r.json())
        .then(data => { setLawyers(Array.isArray(data) ? data : []); setLawyersLoading(false) })
        .catch(() => setLawyersLoading(false))
    }
  }, [activeTab])

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
        u.id === userId
          ? { ...u, status: action === 'ban' ? 'BANNED' : action === 'unban' ? 'ACTIVE' : action === 'suspend' ? 'SUSPENDED' : u.status }
          : u
      ))
    } catch { /* ignore */ }
  }

  const statCards = stats ? [
    { label: 'Toplam Üye',       value: stats.users.total,           delta: `${stats.users.active} aktif`,      color: 'bg-blue-500',   icon: HiUsers               },
    { label: 'Aktif Gönderi',    value: stats.content.posts,         delta: `${stats.content.topics} konu`,    color: 'bg-green-500',  icon: HiChatBubbleLeftRight  },
    { label: 'Bekleyen Şikayet', value: stats.moderation.pendingReports, delta: '!',                           color: 'bg-red-500',    icon: HiFlag                },
    { label: 'Yanıtlanan Soru',  value: `${stats.legal.answered}/${stats.legal.total}`, delta: 'Hukuki',       color: 'bg-orange-500', icon: HiScale               },
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
        <span className="text-sm bg-green-100 text-green-700 px-3 py-1.5 rounded-xl font-medium">
          ● Sistem Aktif
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab ? 'bg-navy-700 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* GENEL BAKIŞ */}
      {activeTab === 'Genel Bakış' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {!stats && [1,2,3,4].map(i => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="h-10 w-10 bg-gray-200 rounded-xl mb-3" />
                <div className="h-7 bg-gray-200 rounded w-1/2 mb-1" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
              </div>
            ))}
            {statCards.map(({ label, value, delta, icon: Icon, color }) => (
              <div key={label} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    delta === '!' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}>{delta}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card p-5">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <HiChartBar className="w-5 h-5 text-gray-400" /> Hızlı İşlemler
              </h2>
              <div className="space-y-2">
                {[
                  { label: 'Bekleyen avukat başvuruları',    count: stats?.users.pendingLawyers ?? '…', color: 'text-blue-600',  tab: 'Avukat Onayı' },
                  { label: 'İncelenmesi gereken şikayetler', count: stats?.moderation.pendingReports ?? '…', color: 'text-red-600', tab: 'Şikayetler' },
                  { label: 'Toplam kullanıcı',               count: stats?.users.total ?? '…', color: 'text-green-600', tab: 'Kullanıcılar' },
                ].map(({ label, count, color, tab }) => (
                  <button key={label} onClick={() => setActiveTab(tab)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all text-left border border-gray-100">
                    <span className="text-sm text-gray-700">{label}</span>
                    <span className={`font-bold text-sm ${color}`}>{count}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="card p-5 flex flex-col items-center justify-center text-center gap-3">
              <HiShieldCheck className="w-12 h-12 text-green-400" />
              <p className="font-bold text-gray-800">Sistem Sağlıklı</p>
              <p className="text-sm text-gray-500">Tüm servisler çalışıyor</p>
            </div>
          </div>
        </div>
      )}

      {/* KULLANICILAR */}
      {activeTab === 'Kullanıcılar' && (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-800">Kullanıcı Yönetimi</h2>
            <span className="text-sm text-gray-500">{users.length} kullanıcı</span>
          </div>
          {usersLoading && (
            <div className="p-8 text-center text-gray-400">Yükleniyor...</div>
          )}
          <div className="divide-y divide-gray-50">
            {users.map((u) => (
              <div key={u.id} className="flex items-center gap-4 px-5 py-3">
                <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{u.name}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[u.role] || 'bg-gray-100 text-gray-700'}`}>
                  {roleLabel[u.role] || u.role}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  u.status === 'ACTIVE' ? 'bg-green-100 text-green-600' :
                  u.status === 'PENDING' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {u.status === 'ACTIVE' ? 'Aktif' : u.status === 'PENDING' ? 'Beklemede' : u.status === 'BANNED' ? 'Banlı' : 'Askıda'}
                </span>
                <div className="flex gap-1">
                  {u.status === 'ACTIVE' && (
                    <button
                      onClick={() => { if (confirm(`${u.name} kullanıcısını askıya al?`)) handleUserAction(u.id, 'suspend') }}
                      className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                      title="Askıya Al"
                    >
                      <HiXCircle className="w-4 h-4" />
                    </button>
                  )}
                  {(u.status === 'SUSPENDED' || u.status === 'BANNED') && (
                    <button
                      onClick={() => handleUserAction(u.id, 'unban')}
                      className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                      title="Aktif Et"
                    >
                      <HiCheckCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {!usersLoading && users.length === 0 && (
              <div className="p-8 text-center text-gray-400">Kullanıcı bulunamadı.</div>
            )}
          </div>
        </div>
      )}

      {/* ŞİKAYETLER */}
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
                <button
                  onClick={() => handleReport(report.id, 'RESOLVED')}
                  disabled={reportLoading === report.id}
                  className="flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50 rounded-xl text-sm font-medium transition-all"
                >
                  <HiCheckCircle className="w-4 h-4" /> {reportLoading === report.id ? '...' : 'İçeriği Kaldır'}
                </button>
                <button
                  onClick={() => handleReport(report.id, 'DISMISSED')}
                  disabled={reportLoading === report.id}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-50 rounded-xl text-sm font-medium transition-all"
                >
                  <HiXCircle className="w-4 h-4" /> {reportLoading === report.id ? '...' : 'Reddet'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AVUKAT ONAYI */}
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
                  <p className="text-xs text-gray-400">{u._count?.answers || 0} yanıt</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleLawyer(u.id, 'approve')}
                  disabled={lawyerLoading === u.id}
                  className="flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50 rounded-xl text-sm font-medium transition-all"
                >
                  <HiCheckCircle className="w-4 h-4" />
                  {lawyerLoading === u.id ? '...' : 'Onayla'}
                </button>
                <button
                  onClick={() => handleLawyer(u.id, 'reject')}
                  disabled={lawyerLoading === u.id}
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50 rounded-xl text-sm font-medium transition-all"
                >
                  <HiXCircle className="w-4 h-4" />
                  {lawyerLoading === u.id ? '...' : 'Reddet'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
