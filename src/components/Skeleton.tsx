export function SkeletonLine({ w = 'w-full', h = 'h-4' }: { w?: string; h?: string }) {
  return <div className={`${w} ${h} bg-gray-200 rounded-lg animate-pulse`} />
}

export function PostSkeleton() {
  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-gray-200 rounded-full animate-pulse" />
        <div className="flex-1 space-y-2">
          <SkeletonLine w="w-32" h="h-3.5" />
          <SkeletonLine w="w-24" h="h-3" />
        </div>
      </div>
      <SkeletonLine h="h-3.5" />
      <SkeletonLine w="w-5/6" h="h-3.5" />
      <SkeletonLine w="w-4/6" h="h-3.5" />
      <div className="flex gap-4 pt-2">
        <SkeletonLine w="w-16" h="h-8" />
        <SkeletonLine w="w-16" h="h-8" />
        <SkeletonLine w="w-16" h="h-8" />
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="h-32 bg-gray-200 animate-pulse" />
      <div className="px-5 pb-5 pt-3 space-y-3">
        <div className="flex items-end gap-3">
          <div className="w-20 h-20 bg-gray-200 rounded-2xl animate-pulse -mt-10" />
        </div>
        <SkeletonLine w="w-40" h="h-5" />
        <SkeletonLine w="w-24" h="h-3" />
        <SkeletonLine h="h-3.5" />
        <SkeletonLine w="w-3/4" h="h-3.5" />
        <div className="flex gap-6 pt-2">
          <SkeletonLine w="w-16" h="h-8" />
          <SkeletonLine w="w-16" h="h-8" />
          <SkeletonLine w="w-16" h="h-8" />
        </div>
      </div>
    </div>
  )
}

export function ForumSkeleton() {
  return (
    <div className="card p-4 space-y-2">
      <SkeletonLine w="w-3/4" h="h-4" />
      <SkeletonLine h="h-3" />
      <div className="flex gap-2 pt-1">
        <SkeletonLine w="w-20" h="h-6" />
        <SkeletonLine w="w-16" h="h-6" />
        <SkeletonLine w="w-12" h="h-6" />
      </div>
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      <div className="h-36 bg-gray-200 rounded-2xl animate-pulse" />
      <div className="flex gap-6">
        <div className="hidden lg:block w-64 space-y-4">
          <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-40 bg-gray-200 rounded-xl animate-pulse" />
        </div>
        <div className="flex-1 space-y-4">
          {[...Array(4)].map((_, i) => <PostSkeleton key={i} />)}
        </div>
      </div>
    </div>
  )
}
