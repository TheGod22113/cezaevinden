import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

interface Props {
  params: { id: string }
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = await prisma.forumTopic.findUnique({
    where: { id: params.id },
    select: { title: true, content: true, category: true, isAnonymous: true },
  })
  if (!topic) return { title: 'Konu Bulunamadı' }
  const desc = topic.content.slice(0, 160).replace(/\n/g, ' ')
  return {
    title: `${topic.title} — Forum`,
    description: desc,
    openGraph: {
      title: topic.title,
      description: desc,
      type: 'article',
    },
  }
}

export default function ForumTopicLayout({ children }: Props) {
  return <>{children}</>
}
