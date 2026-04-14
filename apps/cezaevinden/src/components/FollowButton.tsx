'use client'

import { useState } from 'react'
import { HiUserPlus, HiUserMinus } from 'react-icons/hi2'

interface Props {
  username: string
  initialFollowing: boolean
}

export default function FollowButton({ username, initialFollowing }: Props) {
  const [following, setFollowing] = useState(initialFollowing)
  const [loading, setLoading]     = useState(false)

  const toggle = async () => {
    setLoading(true)
    const res = await fetch(`/api/users/${username}/follow`, { method: 'POST' })
    if (res.ok) {
      const data = await res.json()
      setFollowing(data.following)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-50 ${
        following
          ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'
          : 'bg-navy-700 text-white hover:bg-navy-800'
      }`}
    >
      {following
        ? <><HiUserMinus className="w-4 h-4" /> Takipten Çık</>
        : <><HiUserPlus  className="w-4 h-4" /> Takip Et</>
      }
    </button>
  )
}
