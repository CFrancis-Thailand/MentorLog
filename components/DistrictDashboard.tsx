tsx'use client'

import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import { PATHWAYS, ROOT_CAUSES } from '@/lib/supabase'

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
  '#6A1B9A',
  '#7B1FA2',
  '#8E24AA',
  '#9C27B0',
  '#AB47BC',
  '#BA68C8',
  '#CE93D8',
  '#E1BEE7',
]

// SUPPORT MODALITY COLORS - Teals palette (helping activities)
const supportModalityColors: string[] = [
  '#00695C',
  '#00897B',
  '#26A69A',
  '#4DB6AC',
  '#80CBC4',
]

const sampleDistrictData = {
  name: 'East Jakarta',
  totalSites: 24,
  sitesAtTarget: 16,
  pathwayDistribution: {
    'prioritization': 4,
    'rationalization': 8,
    'transition-ready': 7,
    'graduation': 3,
    're-engagement': 2,
  },
  performanceStacks: [
    { indicator: '1.1', optimal: 8, effective: 10, improving: 4, sub: 1, stressed: 1 },
    { indicator: '2.1', optimal: 5, effective: 8, improving: 6, sub: 3, stressed: 2 },
    { indicator: '3.1', optimal: 6, effective: 9, improving: 5, sub: 2, stressed: 2 },
    { indicator: '4.1', optimal: 10, effective: 8, improving: 4, sub: 1, stressed: 1 },
    { indicator: '5.1', optimal: 4, effective: 6, improving: 7, sub: 4, stressed: 3 },
    { indicator: '6.1', optimal: 7, effective: 9, improving: 5, sub: 2, stressed: 1 },
  ],
  mentors: [
    { name: 'Dewi Suryani', sites: 8, hours: 32, topModality: 'Face-to-face' },
    { name: 'Budi Santoso', sites: 8, hours: 28, topModality: 'Remote' },
    { name: 'Rina Wijaya', sites: 8, hours: 26, topModality: 'Data review' },
  ],
  supportDelivered: {
    totalHours: 87.5,
    byModality: [
      { name: 'Face-to-face', hours: 48 },
      { name: 'Remote', hours: 18 },
      { name: 'Data review', hours: 12 },
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
  escalations: [
    {
      indicator: '5.1',
      indicatorName: 'Multi-Month Dispensing (MMD)',
      facilityType: 'Hospital',
      pctSubOptimal: 100,
      description: 'All 4 hospitals (100%) are performing below Effective threshold on MMD. This suggests a systemic barrier — likely supply chain or policy implementation — requiring provincial-level coordination.',
      affectedSites: [
        { name: 'RS Persahabatan', value: 35 },
        { name: 'RS Fatmawati', value: 42 },
        { name: 'RS Koja', value: 38 },
        { name: 'RS Tarakan', value: 40 },
      ],
    },
  ],
}

export default function DistrictDashboard() {
  const donutRef = useRef<HTMLCanvasElement>(null)
  const barRef = useRef<HTMLCanvasElement>(null)
  const donutInstance = useRef<Chart | null>(null)
  const barInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (donutRef.current) {
      if (donutInstance.current) donutInstance.current.destroy()
      
      donutInstance.current = new Chart(donutRef.current, {
        type: 'doughnut',
        data: {
          labels: sampleDistrictData.supportDelivered.byModality.map(m => m.name),
          datasets: [{
            data: sampleDistrictData.supportDelivered.byModality.map(m => m.hours),
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
              position: 'right',
              labels: { usePointStyle: true, padding: 12, font: { size: 11 } },
            },
          },
        },
      })
    }

    if (barRef.current) {
      if (barInstance.current) barInstance.current.destroy()
      
      barInstance.current = new Chart(barRef.current, {
        type: 'bar',
        data: {
          labels: sampleDistrictData.rootCauseCounts.map(r => 
            ROOT_CAUSES.find(rc => rc.id === r.id)?.name || r.id
          ),
          datasets: [{
            data: sampleDistrictData.rootCauseCounts.map(r => r.count),
            backgroundColor: rootCauseColors,
            borderRadius: 6,
          }],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              beginAtZero: true,
              max: 16,
              grid: { color: 'rgba(0,0,0,0.05)' },
              ticks: { font: { size: 10 } },
            },
            y: {
              grid: { display: false },
              ticks: { font: { size: 12 } },
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
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">District</div>
          <div className="text-2xl font-bold text-epic-navy">{sampleDistrictData.name}</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Total Sites</div>
          <div className="text-2xl font-bold text-epic-navy">{sampleDistrictData.totalSites}</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Sites ≥4 Indicators at Target</div>
          <div className="text-2xl font-bold text-status-optimal">{sampleDistrictData.sitesAtTarget} / {sampleDistrictData.totalSites}</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Support Hours (Q1)</div>
          <div className="text-2xl font-bold text-epic-primary">{sampleDistrictData.supportDelivered.totalHours}</div>
        </div>
      </div>

      {/* Pathway Distribution */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Pathway Distribution</h3>
        <div className="flex gap-2 h-10 rounded-lg overflow-hidden">
          {Object.entries(sampleDistrictData.pathwayDistribution).map(([pathway, count]) => {
            const pct = (count / sampleDistrictData.totalSites) * 100
            return (
              <div
                key={pathway}
                className="flex items-center justify-center text-white text-xs font-bold"
                style={{ 
                  width: `${pct}%`, 
                  backgroundColor: pathwayColors[pathway],
                  minWidth: count > 0 ? '40px' : '0'
                }}
              >
                {count}
              </div>
            )
          })}
        </div>
        <div className="flex flex-wrap gap-4 mt-3">
          {Object.entries(PATHWAYS).map(([key, pathway]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: pathwayColors[key] }}></div>
              <span className="text-xs text-gray-600">{pathway.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Stacks */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Performance by Indicator (All Sites)</h3>
        <div className="space-y-3">
          {sampleDistrictData.performanceStacks.map((ind) => (
            <div key={ind.indicator} className="flex items-center gap-3">
              <div className="w-10 text-sm font-bold text-epic-navy">{ind.indicator}</div>
              <div className="flex-1 flex h-7 rounded overflow-hidden">
                <div className="bg-status-optimal flex items-center justify-center text-white text-xs font-semibold" style={{ width: `${(ind.optimal/24)*100}%` }}>{ind.optimal}</div>
                <div className="bg-status-effective flex items-center justify-center text-white text-xs font-semibold" style={{ width: `${(ind.effective/24)*100}%` }}>{ind.effective}</div>
                <div className="bg-status-improving flex items-center justify-center text-white text-xs font-semibold" style={{ width: `${(ind.improving/24)*100}%` }}>{ind.improving}</div>
                <div className="bg-status-sub flex items-center justify-center text-white text-xs font-semibold" style={{ width: `${(ind.sub/24)*100}%` }}>{ind.sub}</div>
                <div className="bg-status-stressed flex items-center justify-center text-white text-xs font-semibold" style={{ width: `${(ind.stressed/24)*100}%` }}>{ind.stressed}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-4 justify-center">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-status-optimal"></div><span className="text-xs text-gray-600">Optimal</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-status-effective"></div><span className="text-xs text-gray-600">Effective</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-status-improving"></div><span className="text-xs text-gray-600">Improving</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-status-sub"></div><span className="text-xs text-gray-600">Sub</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-status-stressed"></div><span className="text-xs text-gray-600">Stressed</span></div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Support Donut */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Support by Modality</h3>
          <div className="h-52">
            <canvas ref={donutRef}></canvas>
          </div>
        </div>

        {/* Root Causes Bar */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Root Causes (Sites Affected)</h3>
          <div className="h-52">
            <canvas ref={barRef}></canvas>
          </div>
        </div>
      </div>

      {/* Mentors */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Mentor Activity</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {sampleDistrictData.mentors.map((mentor, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-4">
              <div className="font-semibold text-epic-navy mb-2">{mentor.name}</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-epic-primary">{mentor.sites}</div>
                  <div className="text-[10px] text-gray-500 uppercase">Sites</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-epic-primary">{mentor.hours}</div>
                  <div className="text-[10px] text-gray-500 uppercase">Hours</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-epic-navy mt-1">{mentor.topModality}</div>
                  <div className="text-[10px] text-gray-500 uppercase">Top Mode</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Escalations */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">System-Level Escalations</span>
          <span className="px-2.5 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full">
            {sampleDistrictData.escalations.length} Active
          </span>
        </div>
        <div className="space-y-4 mt-4">
          {sampleDistrictData.escalations.map((esc, i) => (
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
