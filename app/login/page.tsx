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
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'linear-gradient(to bottom, #f0f4f8, #dbe4ee)' }}>
      {/* Main Card */}
      <div className="w-full max-w-md">
        {/* App Name & Description */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#1B365D' }}>
            MentorLog
          </h1>
          <p className="text-sm mb-4 italic" style={{ color: '#4472C4' }}>
            Catatan Pendamping
          </p>
          <p className="text-sm leading-relaxed" style={{ color: '#3B5068' }}>
            WhatsApp + web platform for tracking mentorship and site performance
            in Indonesia&apos;s HIV program. Supports the Sustainable Excellence
            framework for transitioning facilities from intensive support to
            self-reliance.
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-lg font-semibold mb-6 text-center" style={{ color: '#1B365D' }}>
            Sign In
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1"
                style={{ color: '#3B5068' }}
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
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-slate-700 placeholder-slate-400"
                style={{ borderColor: '#b0c4d8' }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
                style={{ color: '#3B5068' }}
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
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-slate-700 placeholder-slate-400"
                style={{ borderColor: '#b0c4d8' }}
              />
            </div>

            {error && (
              <div className="text-sm px-4 py-2.5 rounded-lg" style={{ backgroundColor: '#fdecea', color: '#c00000' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#1B365D' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2B5C8A')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1B365D')}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Logos - US on left, EpiC on right */}
        <div className="mt-10 flex items-center justify-center gap-8">
          <Image
            src="/DOS Logo (1).png"
            alt="United States of America"
            width={200}
            height={60}
            className="object-contain"
          />
          <Image
            src="/EpiC Logo (1).png"
            alt="EpiC - Meeting Targets and Maintaining Epidemic Control"
            width={200}
            height={60}
            className="object-contain"
          />
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#8497B0' }}>
          © {new Date().getFullYear()} FHI 360 — EpiC Indonesia
        </p>
      </div>
    </div>
  )
}
