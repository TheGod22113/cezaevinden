import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

interface Props {
  params: { id: string }
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const question = await prisma.legalQuestion.findUnique({
    where: { id: params.id },
    select: { title: true, content: true, category: true, isAnonymous: true },
  })
  if (!question) return { title: 'Soru Bulunamadı' }
  const desc = question.content.slice(0, 160).replace(/\n/g, ' ')
  return {
    title: `${question.title} — Hukuki Yardım`,
    description: desc,
    openGraph: {
      title: question.title,
      description: desc,
      type: 'article',
    },
  }
}

export default function LegalQuestionLayout({ children }: Props) {
  return <>{children}</>
}
