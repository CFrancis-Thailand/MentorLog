'use client'

import { useState } from 'react'
import SiteDashboard from '@/components/SiteDashboard'
import DistrictDashboard from '@/components/DistrictDashboard'
import QuarterlyEntry from '@/components/QuarterlyEntry'

type Tab = 'site' | 'district' | 'entry'

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('site')

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-epic-navy to-[#2a4a6b] text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">MentorLog</h1>
            <p className="text-sm opacity-85">Catatan Pendamping • EpiC Indonesia</p>
          </div>
          <nav className="flex gap-1">
            <button
              onClick={() => setActiveTab('site')}
              className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'site' 
                  ? 'bg-epic-primary' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              Site Dashboard
            </button>
            <button
              onClick={() => setActiveTab('district')}
              className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'district' 
                  ? 'bg-epic-primary' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              District Dashboard
            </button>
            <button
              onClick={() => setActiveTab('entry')}
              className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'entry' 
                  ? 'bg-epic-primary' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              Quarterly Entry
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {activeTab === 'site' && <SiteDashboard />}
        {activeTab === 'district' && <DistrictDashboard />}
        {activeTab === 'entry' && <QuarterlyEntry />}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        MentorLog v1.0 | EpiC Indonesia | Sustainable Excellence Framework
      </footer>
    </div>
  )
}
