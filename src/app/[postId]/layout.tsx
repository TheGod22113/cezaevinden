import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

interface Props {
  params: { postId: string }
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { id: params.postId },
    select: { content: true, isAnonymous: true, category: true },
  })
  if (!post) return { title: 'Gönderi Bulunamadı' }

  // Anonim gönderilerde içerik metadata'ya eklenmez
  if (post.isAnonymous) {
    return {
      title: `${post.category ?? 'Gönderi'} — Cezaevinden.com`,
      description: 'Cezaevinden.com — Mahkumlar, aileler ve gönüllü avukatların platformu.',
    }
  }

  const desc = post.content.slice(0, 160).replace(/\n/g, ' ')
  return {
    title: `${desc.slice(0, 60)}… — Cezaevinden.com`,
    description: desc,
    openGraph: {
      title: 'Cezaevinden.com — Gönderi',
      description: desc,
      type: 'article',
    },
  }
}

export default function PostLayout({ children }: Props) {
  return <>{children}</>
}
