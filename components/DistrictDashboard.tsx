'use client'

import { useState, useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import { PATHWAYS, ROOT_CAUSES } from '@/lib/supabase'
import { getSiteById, SITES } from '@/lib/sites'
import type { Language, Translations } from '@/app/page'

Chart.register(...registerables)

interface DistrictDashboardProps {
  language: Language
  translations: Translations
  selectedSiteId?: number | null
}

// Sample data - in production this would come from Supabase
const sampleDistrictData = {
  name: 'East Jakarta District',
  province: 'DKI Jakarta',
  currentQuarter: '2025-Q1',
  totalSites: 24,
  sitesByType: {
    puskesmas: 18,
    hospital: 4,
    private: 2,
  },
  sitesMeetingTarget: 16, // ≥4 indicators at optimal/effective
  changeFromLastQuarter: 3,
  pathwayDistribution: {
    'prioritization': 6,
    'rationalization': 8,
    'transition-ready': 7,
    'graduation': 2,
    're-engagement': 1,
  },
  indicatorDistribution: {
    '1.1': { optimal: 12, effective: 6, improving: 4, stressed: 2, pctAtTarget: 75 },
    '2.1': { optimal: 8, effective: 7, improving: 5, stressed: 4, pctAtTarget: 63 },
    '3.1': { optimal: 9, effective: 6, improving: 6, stressed: 3, pctAtTarget: 63 },
    '4.1': { optimal: 14, effective: 5, improving: 3, stressed: 2, pctAtTarget: 79 },
    '5.1': { optimal: 6, effective: 8, improving: 6, stressed: 4, pctAtTarget: 58 },
    '6.1': { optimal: 10, effective: 7, improving: 5, stressed: 2, pctAtTarget: 71 },
  },
  supportDelivered: {
    totalHours: 87.5,
    totalVisits: 42,
    byModality: [
      { name: 'Face-to-face', hours: 48 },
      { name: 'Remote', hours: 18 },
      { name: 'Data Review', hours: 12 },
      { name: 'Training', hours: 6 },
      { name: 'Other', hours: 3.5 },
    ],
  },
  rootCauseCounts: [
    { id: 'staffing', count: 14 },
    { id: 'capacity', count: 11 },
    { id: 'me-data', count: 9 },
    { id: 'supply-chain', count: 5 },
    { id: 'service-delivery', count: 4 },
    { id: 'patient-factors', count: 3 },
    { id: 'policy-sops', count: 2 },
    { id: 'leadership', count: 2 },
  ],
  mentors: [
    { name: 'Dewi Suryani', initials: 'DS', sites: 8, hours: 32 },
    { name: 'Budi Santoso', initials: 'BS', sites: 8, hours: 28 },
    { name: 'Rina Wijaya', initials: 'RW', sites: 8, hours: 27.5 },
  ],
  escalations: [
    {
      indicator: '5.1',
      indicatorName: 'Multi-Month Dispensing (MMD)',
      siteType: 'hospital',
      pctSubOptimal: 100,
      affectedSites: [
        { name: 'RS Persahabatan', value: 42 },
        { name: 'RS Islam Jakarta', value: 38 },
        { name: 'RS Harapan Kita', value: 45 },
        { name: 'RS Budhi Asih', value: 35 },
      ],
      description: 'All 4 hospitals (100%) are performing below Effective threshold on MMD. This suggests a systemic barrier — likely supply chain or policy implementation — requiring provincial-level coordination.',
    },
  ],
}

// PATHWAY COLORS - Blues palette (journey/progression)
const pathwayColors: Record<string, string> = {
  'prioritization': '#0D47A1',
  'rationalization': '#1976D2',
  'transition-ready': '#42A5F5',
  'graduation': '#81D4FA',
  're-engagement': '#5C6BC0',
}

// ROOT CAUSE COLORS - Purples palette (challenges)
const rootCauseColors: string[] = [
  '#6A1B9A',  // staffing - darkest
  '#7B1FA2',  // capacity
  '#8E24AA',  // me-data
  '#9C27B0',  // supply-chain
  '#AB47BC',  // service-delivery
  '#BA68C8',  // patient-factors
  '#CE93D8',  // policy-sops
  '#E1BEE7',  // leadership - lightest
]

// SUPPORT MODALITY COLORS - Teals palette (helping activities)
const supportModalityColors: string[] = [
  '#00695C',  // face-to-face
  '#00897B',  // remote
  '#26A69A',  // data-review
  '#4DB6AC',  // training
  '#80CBC4',  // other
]

export default function DistrictDashboard({ language, translations: t, selectedSiteId }: DistrictDashboardProps) {
  // District selection for dashboard
  const [selectedProvince, setSelectedProvince] = useState<string>('Jakarta')
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>('South Jakarta')
  
  const availableDistricts = getDistrictsByProvince(selectedProvince)
  const districtSitesList = SITES.filter(s => s.district === selectedDistrictName)
  const districtPuskesmasCount = districtSitesList.filter(s => s.facilityType === 'Puskesmas').length
  const districtHospitalCount = districtSitesList.filter(s => s.facilityType === 'Hospital').length
  const districtNGOCount = districtSitesList.filter(s => s.facilityType === 'NGO clinic').length
  
  const displayDistrictData = {
    ...sampleDistrictData,
    name: selectedDistrictName + ' District',
    province: selectedProvince,
    totalSites: districtSitesList.length,
    sitesByType: {
      puskesmas: districtPuskesmasCount,
      hospital: districtHospitalCount,
      private: districtNGOCount,
    }
  }


  const selectedSite = selectedSiteId ? getSiteById(selectedSiteId) : null
  const districtSites = selectedSite ? SITES.filter(s => s.district === selectedSite.district) : []
  const activeDistrictData = selectedSite ? { ...sampleDistrictData, name: selectedSite.district + " District", province: selectedSite.province, totalSites: districtSites.length, sitesByType: { puskesmas: districtSites.filter(s => s.facilityType === "Puskesmas").length, hospital: districtSites.filter(s => s.facilityType === "Hospital").length, private: districtSites.filter(s => s.facilityType === "NGO clinic").length } } : sampleDistrictData

  const donutRef = useRef<HTMLCanvasElement>(null)
  const barRef = useRef<HTMLCanvasElement>(null)
  const donutInstance = useRef<Chart | null>(null)
  const barInstance = useRef<Chart | null>(null)

  useEffect(() => {
    // Support Donut Chart
    if (donutRef.current) {
      if (donutInstance.current) donutInstance.current.destroy()
      
      donutInstance.current = new Chart(donutRef.current, {
        type: 'doughnut',
        data: {
          labels: activeDistrictData.supportDelivered.byModality.map(m => m.name),
          datasets: [{
            data: activeDistrictData.supportDelivered.byModality.map(m => m.hours),
            backgroundColor: supportModalityColors,
            borderWidth: 0,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { usePointStyle: true, padding: 12, font: { size: 11 } },
            },
          },
        },
      })
    }

    // Root Cause Bar Chart
    if (barRef.current) {
      if (barInstance.current) barInstance.current.destroy()
      
      barInstance.current = new Chart(barRef.current, {
        type: 'bar',
        data: {
          labels: activeDistrictData.rootCauseCounts.map(r => 
            ROOT_CAUSES.find(rc => rc.id === r.id)?.name || r.id
          ),
          datasets: [{
            data: activeDistrictData.rootCauseCounts.map(r => r.count),
            backgroundColor: rootCauseColors,
            borderRadius: 6,
          }],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => context.raw + ' sites affected',
              },
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              max: 16,
              grid: { color: 'rgba(0,0,0,0.05)' },
              ticks: { font: { size: 11 } },
            },
            y: {
              grid: { display: false },
              ticks: { font: { size: 12, weight: 500 } },
            },
          },
        },
      })
    }

    return () => {
      if (donutInstance.current) donutInstance.current.destroy()
      if (barInstance.current) barInstance.current.destroy()
    }
  }, [])

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Dashboard Header */}
      <div className="mb-6">
        <div className="mb-4 flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-600">Province:</label>
                <select 
                  value={selectedProvince}
                  onChange={(e) => { setSelectedProvince(e.target.value); setSelectedDistrictName('') }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm"
                >
                  {PROVINCES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-600">District:</label>
                <select 
                  value={selectedDistrictName}
                  onChange={(e) => setSelectedDistrictName(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm min-w-[200px]"
                >
                  <option value="">Select district...</option>
                  {availableDistricts.map(d => (
                    <option key={d} value={d}>{d} ({SITES.filter(s => s.district === d).length} sites)</option>
                  ))}
                </select>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-epic-navy">{displayDistrictData.name}</h2>
        <div className="text-sm text-gray-500 mt-1 space-x-4">
          <span>📍 {displayDistrictData.province} Province</span>
          <span>📅 {activeDistrictData.currentQuarter}</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Total Sites */}
        <div className="col-span-12 lg:col-span-3 bg-white rounded-xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Sites</span>
          <div className="text-center mt-4">
            <div className="text-5xl font-bold text-epic-navy">{displayDistrictData.totalSites}</div>
            <div className="text-sm text-gray-500 mt-1">Active Facilities</div>
            <div className="flex justify-center gap-4 mt-3 text-xs text-gray-500">
              <span>🏥 {displayDistrictData.sitesByType.puskesmas} Puskesmas</span>
              <span>🏨 {displayDistrictData.sitesByType.hospital} Hospital</span>
              <span>🏢 {displayDistrictData.sitesByType.private} Private</span>
            </div>
          </div>
        </div>

        {/* Sites Meeting Target */}
        <div className="col-span-12 lg:col-span-3 bg-white rounded-xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sites Meeting ≥4 Indicators</span>
          <div className="flex items-center justify-center mt-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
                <circle cx="65" cy="65" r="54" fill="none" stroke="#D6E8F0" strokeWidth="10" />
                <circle 
                  cx="65" cy="65" r="54" fill="none" 
                  stroke="url(#gradient-effective)" strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="339"
                  strokeDashoffset={339 - (339 * activeDistrictData.sitesMeetingTarget / displayDistrictData.totalSites)}
                />
                <defs>
                  <linearGradient id="gradient-effective" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7CB342" />
                    <stop offset="100%" stopColor="#2E7D32" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-epic-navy">{activeDistrictData.sitesMeetingTarget}</div>
                <div className="text-xs text-gray-500">of {displayDistrictData.totalSites} sites</div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-1 mt-3 text-sm font-semibold text-status-optimal">
            <span>▲</span> +{activeDistrictData.changeFromLastQuarter} sites from Q4 2024
          </div>
        </div>

        {/* Pathway Distribution */}
        <div className="col-span-12 lg:col-span-6 bg-white rounded-xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sites by Technical Support Pathway</span>
          <div className="mt-4 space-y-2.5">
            {Object.entries(activeDistrictData.pathwayDistribution).map(([key, count]) => {
              const pct = (count / displayDistrictData.totalSites) * 100
              return (
                <div key={key} className="flex items-center gap-3">
                  <span 
                    className="w-28 text-xs font-semibold"
                    style={{ color: pathwayColors[key] }}
                  >
                    {PATHWAYS[key as keyof typeof PATHWAYS].name}
                  </span>
                  <div className="flex-1 h-6 bg-gray-100 rounded-md overflow-hidden">
                    <div 
                      className="h-full rounded-md flex items-center pl-2 text-xs font-bold text-white"
                      style={{ 
                        width: `${Math.max(pct, 8)}%`,
                        background: `linear-gradient(90deg, ${pathwayColors[key]}99, ${pathwayColors[key]})` 
                      }}
                    >
                      {count}
                    </div>
                  </div>
                  <span className="w-8 text-right text-sm font-bold text-epic-navy">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Performance by Indicator */}
        <div className="col-span-12 lg:col-span-7 bg-white rounded-xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Site Distribution by Indicator Performance</span>
          <div className="mt-4 space-y-4">
            {Object.entries(activeDistrictData.indicatorDistribution).map(([key, data]) => (
              <div key={key} className="flex items-center gap-3">
                <span className="w-12 text-sm font-semibold text-epic-navy">{key}</span>
                <div className="flex-1 h-8 flex rounded-md overflow-hidden">
                  <div 
                    className="bg-status-optimal flex items-center justify-center text-xs font-bold text-white"
                    style={{ width: `${(data.optimal / 24) * 100}%` }}
                  >
                    {data.optimal}
                  </div>
                  <div 
                    className="bg-status-effective flex items-center justify-center text-xs font-bold text-white"
                    style={{ width: `${(data.effective / 24) * 100}%` }}
                  >
                    {data.effective}
                  </div>
                  <div 
                    className="bg-status-improving flex items-center justify-center text-xs font-bold text-white"
                    style={{ width: `${(data.improving / 24) * 100}%` }}
                  >
                    {data.improving}
                  </div>
                  <div 
                    className="bg-status-stressed flex items-center justify-center text-xs font-bold text-white"
                    style={{ width: `${(data.stressed / 24) * 100}%` }}
                  >
                    {data.stressed}
                  </div>
                </div>
                <span className="w-12 text-right text-sm font-bold text-epic-navy">{data.pctAtTarget}%</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-5 mt-4 text-xs flex-wrap">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-status-optimal"></div> Optimal</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-status-effective"></div> Effective</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-status-improving"></div> Improving</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-status-stressed"></div> Stressed</div>
            <span className="text-gray-400 italic ml-2">% = sites at Optimal/Effective</span>
          </div>
        </div>

        {/* Support Delivered */}
        <div className="col-span-12 lg:col-span-5 bg-white rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Technical Support Delivered</span>
            <span className="text-xs text-epic-primary">{activeDistrictData.currentQuarter}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-epic-navy">{activeDistrictData.supportDelivered.totalHours}</div>
              <div className="text-xs text-gray-500">Total Hours</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-epic-navy">{activeDistrictData.supportDelivered.totalVisits}</div>
              <div className="text-xs text-gray-500">Total Visits</div>
            </div>
          </div>
          <div className="relative h-44">
            <canvas ref={donutRef}></canvas>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-2xl font-bold text-epic-navy">{activeDistrictData.supportDelivered.totalHours}</div>
              <div className="text-xs text-gray-500">hours</div>
            </div>
          </div>
        </div>

        {/* Root Causes */}
        <div className="col-span-12 lg:col-span-6 bg-white rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Common Root Causes</span>
            <span className="text-xs text-epic-primary">Sites Affected</span>
          </div>
          <div className="h-64">
            <canvas ref={barRef}></canvas>
          </div>
        </div>

        {/* Mentors */}
        <div className="col-span-12 lg:col-span-6 bg-white rounded-xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mentor Activity</span>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {activeDistrictData.mentors.map((m, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-epic-primary to-epic-navy flex items-center justify-center text-white font-bold text-lg">
                  {m.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-epic-navy">{m.name}</div>
                  <div className="text-[10px] text-gray-500">District Mentor</div>
                  <div className="flex gap-3 mt-1 text-xs">
                    <span><strong>{m.sites}</strong> sites</span>
                    <span><strong>{m.hours}</strong> hrs</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Escalations */}
        <div className="col-span-12 bg-white rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">System-Level Escalations</span>
            <span className="px-2.5 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full">
              {activeDistrictData.escalations.length} Active
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Escalations trigger when &gt;75% of sites within a facility type perform sub-optimally on a specific indicator
          </p>
          
          {activeDistrictData.escalations.map((esc, i) => (
            <div key={i} className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-4 border-l-4 border-amber-500">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">⚠️</span>
                <span className="font-bold text-amber-700">
                  Indicator {esc.indicator}: {esc.indicatorName}
                </span>
                <span className="ml-auto px-2.5 py-1 bg-amber-500 text-white text-xs font-semibold rounded">
                  Hospitals: {esc.pctSubOptimal}% sub-optimal
                </span>
              </div>
              <p className="text-sm text-epic-navy leading-relaxed mb-3">{esc.description}</p>
              <div className="flex flex-wrap gap-2">
                {esc.affectedSites.map((site, j) => (
                  <span key={j} className="px-2.5 py-1 bg-white rounded text-xs font-medium text-epic-navy border border-amber-200">
                    {site.name} ({site.value}%)
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
