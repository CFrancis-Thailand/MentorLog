'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter, usePathname } from 'next/navigation'
import { Session } from '@supabase/supabase-js'

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
      if (!session && pathname !== '/login') {
        router.push('/login')
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        if (!session && pathname !== '/login') {
          router.push('/login')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router, pathname])

  // Show nothing while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500">Loading...</div>
      </div>
    )
  }

  // If on login page, show it regardless of auth
  if (pathname === '/login') {
    return <>{children}</>
  }

  // If not logged in, show nothing (will redirect)
  if (!session) {
    return null
  }

  // Logged in — show the app
  return <>{children}</>
}
