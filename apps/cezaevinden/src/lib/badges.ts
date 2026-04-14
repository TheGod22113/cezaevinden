import { prisma } from './prisma'

export const BADGE_META: Record<string, { label: string; emoji: string; desc: string; color: string }> = {
  ILK_GONDERI:        { label: 'İlk Adım',           emoji: '🌱', desc: 'İlk gönderiyi paylaştı',              color: 'bg-green-100 text-green-700'  },
  ILK_YORUM:          { label: 'Sohbetçi',            emoji: '💬', desc: 'İlk yorumu yaptı',                    color: 'bg-blue-100 text-blue-700'    },
  AKTIF_UYE:          { label: 'Sadık Üye',            emoji: '⭐', desc: '30+ gündür platformda',              color: 'bg-yellow-100 text-yellow-700' },
  FORUMC:             { label: 'Forum Katkısı',        emoji: '🗣️', desc: '5+ forum konusu açtı',               color: 'bg-purple-100 text-purple-700' },
  HUKUK_DESTEKCI:     { label: 'Hukuk Destekçisi',    emoji: '⚖️', desc: 'Hukuki soruya yanıt verdi',          color: 'bg-blue-100 text-blue-800'    },
  TOPLULUK_KAHRAMANI: { label: 'Topluluk Kahramanı',  emoji: '🏆', desc: '50+ beğeni kazandı',                 color: 'bg-gold-500 text-white'       },
  DAYANISMA:          { label: 'Dayanışma Ruhu',       emoji: '🤝', desc: '20+ yorum yaparak destek oldu',     color: 'bg-teal-100 text-teal-700'    },
  DS_KULLANICI:       { label: 'DS Takipçisi',         emoji: '📋', desc: 'Denetimli serbestlik hatırlatması kurdu', color: 'bg-orange-100 text-orange-700' },
  SORUCU:             { label: 'Hukuk Arayan',         emoji: '🔍', desc: 'Hukuki soru sordu',                 color: 'bg-indigo-100 text-indigo-700' },
  KAHRAMAN_100:       { label: '100 Katkı Kahramanı', emoji: '💯', desc: '100+ gönderi/yorum yaptı',           color: 'bg-crimson-600 text-white'    },
}

// Bir kullanıcı için rozet kontrolü yap ve eksik rozetleri ver
export async function checkAndAwardBadges(userId: string): Promise<string[]> {
  const [user, existingBadges, postCount, commentCount, forumCount, legalCount, totalLikes, dsSchedule] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { createdAt: true, role: true } }),
    prisma.userBadge.findMany({ where: { userId }, select: { type: true } }),
    prisma.post.count({ where: { authorId: userId } }),
    prisma.comment.count({ where: { authorId: userId } }),
    prisma.forumTopic.count({ where: { authorId: userId } }),
    prisma.legalAnswer.count({ where: { authorId: userId } }),
    prisma.like.count({ where: { post: { authorId: userId } } }),
    prisma.dsSchedule.findUnique({ where: { userId } }),
  ])

  if (!user) return []

  const earned = new Set(existingBadges.map(b => b.type))
  const toAward: string[] = []

  const daysSinceJoin = (Date.now() - user.createdAt.getTime()) / 86400000

  const checks: [string, boolean][] = [
    ['ILK_GONDERI',        postCount >= 1],
    ['ILK_YORUM',          commentCount >= 1],
    ['AKTIF_UYE',          daysSinceJoin >= 30],
    ['FORUMC',             forumCount >= 5],
    ['HUKUK_DESTEKCI',     legalCount >= 1],
    ['TOPLULUK_KAHRAMANI', totalLikes >= 50],
    ['DAYANISMA',          commentCount >= 20],
    ['DS_KULLANICI',       !!dsSchedule],
    ['SORUCU',             legalCount >= 1 || user.role === 'AVUKAT'],
    ['KAHRAMAN_100',       postCount + commentCount >= 100],
  ]

  for (const [type, condition] of checks) {
    if (condition && !earned.has(type as any)) {
      toAward.push(type)
    }
  }

  if (toAward.length > 0) {
    await prisma.userBadge.createMany({
      data: toAward.map(type => ({ userId, type: type as any })),
      skipDuplicates: true,
    })
  }

  return toAward
}
