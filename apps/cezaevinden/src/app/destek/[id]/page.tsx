import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { HiArrowLeft, HiMapPin, HiPhone, HiGlobeAlt, HiEnvelope, HiCheckBadge } from 'react-icons/hi2'
import ShareButton from '@/components/ShareButton'

interface Props { params: { id: string } }

const categoryColors: Record<string, string> = {
  'Hukuki Yardım':   'bg-blue-100 text-blue-700',
  'Barınma':         'bg-green-100 text-green-700',
  'Psikolojik':      'bg-purple-100 text-purple-700',
  'İş & Kariyer':    'bg-orange-100 text-orange-700',
  'Maddi Yardım':    'bg-yellow-100 text-yellow-700',
}

export default async function DestekDetayPage({ params }: Props) {
  const resource = await prisma.supportResource.findUnique({
    where: { id: params.id },
  })

  if (!resource) notFound()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/destek"
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-navy-700 mb-6 transition-colors">
        <HiArrowLeft className="w-4 h-4" /> Destek Ağına Dön
      </Link>

      <div className="card p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-black text-gray-900">{resource.name}</h1>
              {resource.verified && <HiCheckBadge className="w-5 h-5 text-blue-500" />}
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${categoryColors[resource.category] ?? 'bg-gray-100 text-gray-600'}`}>
              {resource.category}
            </span>
          </div>
          <ShareButton title={resource.name} url={`/destek/${resource.id}`} />
        </div>

        <p className="text-gray-700 leading-relaxed mb-6">{resource.description}</p>

        <div className="space-y-3">
          {resource.city && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <HiMapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
              {resource.city}
            </div>
          )}
          {resource.phone && (
            <a href={`tel:${resource.phone}`}
              className="flex items-center gap-3 text-sm text-navy-700 hover:underline">
              <HiPhone className="w-5 h-5 text-gray-400 flex-shrink-0" />
              {resource.phone}
            </a>
          )}
          {resource.email && (
            <a href={`mailto:${resource.email}`}
              className="flex items-center gap-3 text-sm text-navy-700 hover:underline">
              <HiEnvelope className="w-5 h-5 text-gray-400 flex-shrink-0" />
              {resource.email}
            </a>
          )}
          {resource.website && (
            <a href={resource.website} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-navy-700 hover:underline">
              <HiGlobeAlt className="w-5 h-5 text-gray-400 flex-shrink-0" />
              {resource.website}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
