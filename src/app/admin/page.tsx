'use client'

import { useState } from 'react'
import {
  HiUsers, HiChatBubbleLeftRight, HiScale, HiNewspaper,
  HiFlag, HiCheckCircle, HiXCircle, HiEye, HiTrash,
  HiShieldCheck, HiArrowTrendingUp, HiClock, HiBell,
  HiUserPlus, HiChartBar,
} from 'react-icons/hi2'

const stats = [
  { label: 'Toplam Üye',       value: '24.547', delta: '+142 bugün',  icon: HiUsers,               color: 'bg-blue-500'   },
  { label: 'Aktif Gönderi',    value: '1.423',  delta: '+38 bugün',   icon: HiChatBubbleLeftRight,  color: 'bg-green-500'  },
  { label: 'Bekleyen Şikayet', value: '17',     delta: '!',           icon: HiFlag,                 color: 'bg-red-500'    },
  { label: 'Yanıt Bekleyen',   value: '94',     delta: 'Hukuki soru', icon: HiScale,                color: 'bg-orange-500' },
]

const pendingUsers = [
  { id: '1', name: 'Av. Selin Kara',   role: 'avukat',  email: 'selin@example.com', date: '2 saat önce',  baroNo: 'Ankara #14523' },
  { id: '2', name: 'Av. Taner Yıldız', role: 'avukat',  email: 'taner@example.com', date: '5 saat önce',  baroNo: 'İzmir #8821'   },
  { id: '3', name: 'Mehmet Arslan',     role: 'mahkum',  email: 'mehmet@example.com',date: '1 gün önce',   baroNo: null            },
]

const reportedPosts = [
  { id: '1', content: 'Kişisel bilgi paylaşımı içeren gönderi...', author: 'kullanici123', reports: 5,  reason: 'Gizlilik İhlali'    },
  { id: '2', content: 'Uygunsuz dil içeren yorum...',               author: 'anonim_99',   reports: 3,  reason: 'Hakaret'            },
  { id: '3', content: 'Yanıltıcı hukuki bilgi içeriği...',          author: 'hukukcu_x',   reports: 8,  reason: 'Yanlış Bilgi'       },
]

const recentActivity = [
  { text: 'Yeni avukat başvurusu: Av. Selin Kara',         time: '2 dk önce',  type: 'user'    },
  { text: '5 şikayet raporu yeni gönderi için açıldı',     time: '15 dk önce', type: 'warning' },
  { text: 'Forum konusu viral oldu: 1.2K görüntülenme',    time: '1 sa önce',  type: 'trending'},
  { text: 'Yeni üye kaydı: 142 kişi bugün katıldı',        time: '2 sa önce',  type: 'user'    },
  { text: 'Hukuki soru cevaplandı: Av. Mehmet Yılmaz',     time: '3 sa önce',  type: 'legal'   },
]

const tabs = ['Genel Bakış', 'Kullanıcılar', 'Şikayetler', 'Avukat Onayı']

const initialUsers = [
  { name: 'Ahmet Kaya',   role: 'tahliye', email: 'ahmet@example.com',  joined: '2 gün önce',  status: 'aktif'  },
  { name: 'Fatma Yıldız', role: 'aile',    email: 'fatma@example.com',  joined: '5 gün önce',  status: 'aktif'  },
  { name: 'Anonim_4521',  role: 'mahkum',  email: '***@example.com',    joined: '1 hafta önce',status: 'aktif'  },
  { name: 'Mehmet Demir', role: 'gonullu', email: 'mehmet@example.com', joined: '2 hafta önce',status: 'askıda' },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('Genel Bakış')
  const [approved, setApproved] = useState<Set<string>>(new Set())
  const [rejected, setRejected] = useState<Set<string>>(new Set())
  const [reports, setReports] = useState(reportedPosts)
  const [reportLoading, setReportLoading] = useState<string | null>(null)
  const [users, setUsers] = useState(initialUsers)

  const handleReport = async (id: string, action: 'resolve' | 'dismiss') => {
    setReportLoading(id)
    try {
      await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      })
      setReports(prev => prev.filter(r => r.id !== id))
    } catch { /* ignore */ }
    setReportLoading(null)
  }

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
        <div className="flex items-center gap-2">
          <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-all">
            <HiBell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <span className="text-sm bg-green-100 text-green-700 px-3 py-1.5 rounded-xl font-medium">
            ● Sistem Aktif
          </span>
        </div>
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
          {/* İstatistik Kartları */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(({ label, value, delta, icon: Icon, color }) => (
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
            {/* Son Aktiviteler */}
            <div className="card p-5">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <HiClock className="w-5 h-5 text-gray-400" /> Son Aktiviteler
              </h2>
              <div className="space-y-3">
                {recentActivity.map(({ text, time, type }, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                      type === 'warning' ? 'bg-red-400' :
                      type === 'trending' ? 'bg-orange-400' :
                      type === 'legal' ? 'bg-blue-400' : 'bg-green-400'
                    }`}/>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-700">{text}</p>
                      <p className="text-xs text-gray-400">{time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hızlı İşlemler */}
            <div className="card p-5">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <HiChartBar className="w-5 h-5 text-gray-400" /> Hızlı İşlemler
              </h2>
              <div className="space-y-2">
                {[
                  { label: 'Bekleyen avukat başvuruları',  count: 2,  color: 'text-blue-600',  tab: 'Avukat Onayı'  },
                  { label: 'İncelenmesi gereken şikayetler', count: 17, color: 'text-red-600',   tab: 'Şikayetler'    },
                  { label: 'Yeni üye onayları',             count: 8,  color: 'text-green-600', tab: 'Kullanıcılar'  },
                ].map(({ label, count, color, tab }) => (
                  <button key={label} onClick={() => setActiveTab(tab)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all text-left border border-gray-100">
                    <span className="text-sm text-gray-700">{label}</span>
                    <span className={`font-bold text-sm ${color}`}>{count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KULLANICILAR */}
      {activeTab === 'Kullanıcılar' && (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-800">Kullanıcı Yönetimi</h2>
            <span className="text-sm text-gray-500">24.547 üye</span>
          </div>
          <div className="divide-y divide-gray-50">
            {users.map((u, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3">
                <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{u.name}</p>
                  <p className="text-xs text-gray-400">{u.email} · {u.joined}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  u.role === 'avukat' ? 'bg-blue-100 text-blue-700' :
                  u.role === 'aile' ? 'bg-green-100 text-green-700' :
                  u.role === 'tahliye' ? 'bg-teal-100 text-teal-700' :
                  u.role === 'mahkum' ? 'bg-orange-100 text-orange-700' :
                  'bg-purple-100 text-purple-700'
                }`}>{u.role}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${u.status === 'aktif' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                  {u.status}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => alert(`Kullanıcı: ${u.name}\nE-posta: ${u.email}\nRol: ${u.role}\nDurum: ${u.status}`)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Kullanıcıyı Görüntüle"
                  >
                    <HiEye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`${u.name} kullanıcısını silmek istediğinize emin misiniz?`)) {
                        setUsers(prev => prev.filter((_, idx) => idx !== i))
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Kullanıcıyı Sil"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ŞİKAYETLER */}
      {activeTab === 'Şikayetler' && (
        <div className="space-y-3">
          {reports.length === 0 && (
            <div className="card p-8 text-center text-gray-400">
              <HiCheckCircle className="w-10 h-10 mx-auto mb-2 text-green-400" />
              <p className="font-medium">Bekleyen şikayet yok</p>
            </div>
          )}
          {reports.map(post => (
            <div key={post.id} className="card p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium mb-2 inline-block">
                    {post.reports} şikayet · {post.reason}
                  </span>
                  <p className="text-sm text-gray-700">{post.content}</p>
                  <p className="text-xs text-gray-400 mt-1">Yazan: @{post.author}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-3 border-t border-gray-50">
                <button
                  onClick={() => handleReport(post.id, 'resolve')}
                  disabled={reportLoading === post.id}
                  className="flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50 rounded-xl text-sm font-medium transition-all"
                >
                  <HiCheckCircle className="w-4 h-4" /> {reportLoading === post.id ? '...' : 'Onayla (Kaldır)'}
                </button>
                <button
                  onClick={() => handleReport(post.id, 'dismiss')}
                  disabled={reportLoading === post.id}
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50 rounded-xl text-sm font-medium transition-all"
                >
                  <HiXCircle className="w-4 h-4" /> {reportLoading === post.id ? '...' : 'Reddet'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AVUKAT ONAYI */}
      {activeTab === 'Avukat Onayı' && (
        <div className="space-y-3">
          {pendingUsers.map(u => (
            <div key={u.id} className="card p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {u.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{u.name}</p>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{u.role}</span>
                  </div>
                  <p className="text-xs text-gray-500">{u.email} · {u.date}</p>
                  {u.baroNo && <p className="text-xs text-blue-600 mt-0.5">🏛️ {u.baroNo}</p>}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { const s = new Set(approved); s.add(u.id); setApproved(s) }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    approved.has(u.id) ? 'bg-green-500 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  <HiCheckCircle className="w-4 h-4" />
                  {approved.has(u.id) ? 'Onaylandı ✓' : 'Onayla'}
                </button>
                <button
                  onClick={() => { const s = new Set(rejected); s.add(u.id); setRejected(s) }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    rejected.has(u.id) ? 'bg-red-500 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  <HiXCircle className="w-4 h-4" />
                  {rejected.has(u.id) ? 'Reddedildi ✗' : 'Reddet'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
