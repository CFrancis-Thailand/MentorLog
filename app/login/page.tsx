'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Invalid email or password. Please try again.')
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center px-4">
      {/* Main Card */}
      <div className="w-full max-w-md">
        {/* App Name & Description */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            MentorLog
          </h1>
          <p className="text-sm text-slate-500 mb-4 italic">
            Catatan Pendamping
          </p>
          <p className="text-slate-600 text-sm leading-relaxed">
            WhatsApp + web platform for tracking mentorship and site performance
            in Indonesia&apos;s HIV program. Supports the Sustainable Excellence
            framework for transitioning facilities from intensive support to
            self-reliance.
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-lg font-semibold text-slate-700 mb-6 text-center">
            Sign In
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-600 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@fhi360.org"
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 placeholder-slate-400"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-600 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 placeholder-slate-400"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Logos */}
        <div className="mt-10 flex items-center justify-center gap-8">
          <Image
            src="/epic-logo.png"
            alt="EpiC - Meeting Targets and Maintaining Epidemic Control"
            width={200}
            height={60}
            className="object-contain"
          />
          <Image
            src="/dos-logo.png"
            alt="United States of America"
            width={200}
            height={60}
            className="object-contain"
          />
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          © {new Date().getFullYear()} FHI 360 — EpiC Indonesia
        </p>
      </div>
    </div>
  )
}
