'use client'

import { useState, useEffect } from 'react'
import { 
  THRESHOLDS, 
  INDICATOR_NAMES, 
  INDICATOR_DESCRIPTIONS,
  PATHWAYS,
  getIndicatorStatus,
  type PerformanceStatus 
} from '@/lib/supabase'

interface IndicatorValue {
  value: string
  status: PerformanceStatus | null
}

const statusColors: Record<PerformanceStatus, string> = {
  'optimal': 'border-status-optimal bg-green-50',
  'effective': 'border-status-effective bg-lime-50',
  'improving': 'border-status-improving bg-orange-50',
  'sub-improving': 'border-status-sub bg-orange-100',
  'stressed': 'border-status-stressed bg-red-50',
}

const statusBadgeColors: Record<PerformanceStatus, string> = {
  'optimal': 'bg-status-optimal',
  'effective': 'bg-status-effective',
  'improving': 'bg-status-improving',
  'sub-improving': 'bg-status-sub',
  'stressed': 'bg-status-stressed',
}

const statusLabels: Record<PerformanceStatus, string> = {
  'optimal': 'Optimal',
  'effective': 'Effective',
  'improving': 'Improving',
  'sub-improving': 'Sub',
  'stressed': 'Stressed',
}

export default function QuarterlyEntry() {
  const [selectedSite, setSelectedSite] = useState('')
  const [selectedQuarter, setSelectedQuarter] = useState('2025-Q1')
  const [siteType, setSiteType] = useState('puskesmas')
  const [patientCount, setPatientCount] = useState('342')
  const [selectedPathway, setSelectedPathway] = useState('')
  const [selectedMentor, setSelectedMentor] = useState('')
  const [showThresholds, setShowThresholds] = useState(false)
  
  const [indicators, setIndicators] = useState<Record<string, IndicatorValue>>({
    '1.1': { value: '', status: null },
    '2.1': { value: '', status: null },
    '3.1': { value: '', status: null },
    '4.1': { value: '', status: null },
    '5.1': { value: '', status: null },
    '6.1': { value: '', status: null },
  })

  const handleIndicatorChange = (indicator: string, value: string) => {
    const numValue = value === '' ? null : parseFloat(value)
    const status = numValue !== null ? getIndicatorStatus(indicator, numValue) : null
    
    setIndicators(prev => ({
      ...prev,
      [indicator]: { value, status }
    }))
  }

  const countAtTarget = Object.values(indicators).filter(
    i => i.status === 'optimal' || i.status === 'effective'
  ).length

  const countImproving = Object.values(indicators).filter(
    i => i.status === 'improving' || i.status === 'sub-improving'
  ).length

  const countStressed = Object.values(indicators).filter(
    i => i.status === 'stressed'
  ).length

  const handleSave = () => {
    if (!selectedSite) {
      alert('Please select a site.')
      return
    }
    if (!selectedPathway) {
      alert('Please select a Technical Support Pathway.')
      return
    }
    
    // In production, this would save to Supabase
    alert(`Quarterly data saved successfully!\n\nSite: ${selectedSite}\nPathway: ${selectedPathway}\n\n(Demo mode - data not persisted to database yet)`)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Page Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-epic-navy">Quarterly Data Entry</h2>
        <p className="text-gray-500 text-sm mt-1">Enter site performance data at the start of each quarter</p>
      </div>

      {/* Site Information Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 pb-3 border-b-2 border-epic-light-blue">
          Site Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1.5 font-medium">Select Site</label>
            <select 
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-epic-primary focus:ring-2 focus:ring-epic-primary/10"
            >
              <option value="">-- Select a site --</option>
              <option value="pkm-kramat-jati">PKM Kramat Jati</option>
              <option value="pkm-pasar-minggu">PKM Pasar Minggu</option>
              <option value="pkm-tebet">PKM Tebet</option>
              <option value="rs-persahabatan">RS Persahabatan</option>
              <option value="pkm-cipinang">PKM Cipinang</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1.5 font-medium">Quarter</label>
            <select 
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-epic-primary focus:ring-2 focus:ring-epic-primary/10"
            >
              <option value="2025-Q1">Q1 2025 (Jan - Mar)</option>
              <option value="2024-Q4">Q4 2024 (Oct - Dec)</option>
              <option value="2024-Q3">Q3 2024 (Jul - Sep)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1.5 font-medium">Site Type</label>
            <select 
              value={siteType}
              onChange={(e) => setSiteType(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-epic-primary focus:ring-2 focus:ring-epic-primary/10"
            >
              <option value="puskesmas">Puskesmas</option>
              <option value="hospital">Hospital</option>
              <option value="private">Private Clinic</option>
              <option value="community">Community-Based</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1.5 font-medium">Current on Treatment (Patients)</label>
            <input 
              type="number" 
              value={patientCount}
              onChange={(e) => setPatientCount(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-epic-primary focus:ring-2 focus:ring-epic-primary/10"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Performance Indicators Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 pb-3 border-b-2 border-epic-light-blue">
          Core Indicator Performance
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Enter the percentage achieved for each indicator. Status colors update automatically based on Sustainable Excellence thresholds.
        </p>

        <div className="space-y-3">
          {Object.entries(INDICATOR_NAMES).map(([key, name]) => (
            <div key={key} className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-epic-primary transition-colors">
              <div className="w-12 h-12 bg-epic-light-blue rounded-lg flex items-center justify-center font-bold text-epic-navy mr-4 flex-shrink-0">
                {key}
              </div>
              <div className="flex-1 min-w-0 mr-4">
                <div className="font-semibold text-sm text-epic-navy">{name}</div>
                <div className="text-xs text-gray-500 truncate">{INDICATOR_DESCRIPTIONS[key as keyof typeof INDICATOR_DESCRIPTIONS]}</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={indicators[key].value}
                  onChange={(e) => handleIndicatorChange(key, e.target.value)}
                  placeholder="--"
                  min="0"
                  max="100"
                  className={`w-20 px-3 py-2.5 border-2 rounded-lg text-center font-semibold text-lg transition-all focus:outline-none ${
                    indicators[key].status 
                      ? statusColors[indicators[key].status!] 
                      : 'border-gray-300'
                  }`}
                />
                <span className="font-semibold text-epic-navy">%</span>
                <span className={`px-2.5 py-1 rounded text-xs font-semibold text-white min-w-[70px] text-center ${
                  indicators[key].status 
                    ? statusBadgeColors[indicators[key].status!] 
                    : 'bg-gray-300'
                }`}>
                  {indicators[key].status ? statusLabels[indicators[key].status!] : '--'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Thresholds Toggle */}
        <button 
          onClick={() => setShowThresholds(!showThresholds)}
          className="flex items-center gap-2 mt-4 text-epic-primary text-sm hover:underline"
        >
          <span>📊</span> {showThresholds ? 'Hide' : 'View'} Performance Thresholds Reference
        </button>

        {showThresholds && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="bg-epic-navy text-white p-2 text-left rounded-tl">Indicator</th>
                  <th className="bg-green-100 p-2 text-center">Optimal</th>
                  <th className="bg-lime-100 p-2 text-center">Effective</th>
                  <th className="bg-orange-100 p-2 text-center">Improving</th>
                  <th className="bg-orange-200 p-2 text-center">(Sub)</th>
                  <th className="bg-red-100 p-2 text-center rounded-tr">Stressed</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(THRESHOLDS).map(([key, t]) => (
                  <tr key={key} className="border-b border-gray-200">
                    <td className="p-2 font-medium">{key}</td>
                    <td className="p-2 text-center bg-green-50">&gt;{t.optimal}%</td>
                    <td className="p-2 text-center bg-lime-50">{t.effective}-{t.optimal - 1}%</td>
                    <td className="p-2 text-center bg-orange-50">{t.improving}-{t.effective - 1}%</td>
                    <td className="p-2 text-center bg-orange-100">{t.sub}-{t.improving - 1}%</td>
                    <td className="p-2 text-center bg-red-50">&lt;{t.sub}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-gray-500 italic">Source: Sustainable Excellence Framework, February 2026</p>
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 p-5 bg-gradient-to-br from-epic-light-blue to-blue-50 rounded-lg">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-epic-navy">{countAtTarget}</div>
              <div className="text-xs text-gray-500 mt-1">Optimal / Effective</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-epic-navy">{countImproving}</div>
              <div className="text-xs text-gray-500 mt-1">Improving</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-epic-navy">{countStressed}</div>
              <div className="text-xs text-gray-500 mt-1">Stressed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pathway Assignment Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 pb-3 border-b-2 border-epic-light-blue">
          Technical Support Pathway Assignment
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Based on the performance data entered above, select the appropriate pathway for this quarter.
        </p>

        <div className="space-y-2">
          {Object.entries(PATHWAYS).map(([key, pathway]) => (
            <label 
              key={key}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedPathway === key 
                  ? 'border-epic-primary bg-epic-light-blue' 
                  : 'border-gray-200 hover:border-epic-primary'
              }`}
            >
              <input
                type="radio"
                name="pathway"
                value={key}
                checked={selectedPathway === key}
                onChange={(e) => setSelectedPathway(e.target.value)}
                className="hidden"
              />
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                selectedPathway === key ? 'border-epic-primary' : 'border-gray-300'
              }`}>
                {selectedPathway === key && (
                  <div className="w-2.5 h-2.5 rounded-full bg-epic-primary"></div>
                )}
              </div>
              <span 
                className="px-3 py-1 rounded text-xs font-semibold text-white mr-3"
                style={{ backgroundColor: pathway.color }}
              >
                {pathway.name}
              </span>
              <div className="flex-1">
                <div className="font-semibold text-sm text-epic-navy">{pathway.description}</div>
                <div className="text-xs text-gray-500">Contact frequency: {pathway.contactFrequency}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Mentor Assignment Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 pb-3 border-b-2 border-epic-light-blue">
          Mentor Assignment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1.5 font-medium">Assigned Mentor</label>
            <select 
              value={selectedMentor}
              onChange={(e) => setSelectedMentor(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-epic-primary focus:ring-2 focus:ring-epic-primary/10"
            >
              <option value="">-- Select mentor --</option>
              <option value="dewi">Dewi Suryani (District Mentor)</option>
              <option value="budi">Budi Santoso (District Mentor)</option>
              <option value="rina">Rina Wijaya (District Mentor)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1.5 font-medium">Expected Contact Frequency</label>
            <input 
              type="text" 
              readOnly
              value={selectedPathway ? PATHWAYS[selectedPathway as keyof typeof PATHWAYS].contactFrequency : 'Based on pathway selection'}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button className="px-6 py-3 border-2 border-gray-300 rounded-lg text-sm font-semibold text-epic-navy hover:border-epic-navy transition-colors">
          Cancel
        </button>
        <button 
          onClick={handleSave}
          className="flex-1 px-6 py-3 bg-epic-primary text-white rounded-lg text-sm font-semibold hover:bg-epic-primary/90 transition-colors"
        >
          Save Quarterly Data
        </button>
      </div>
    </div>
  )
}
