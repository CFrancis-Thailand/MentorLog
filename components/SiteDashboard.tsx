'use client'

import { useState, useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import { 
  THRESHOLDS,
  INDICATOR_NAMES,
  PATHWAYS,
  ROOT_CAUSES,
  getIndicatorStatus,
  type PerformanceStatus
} from '@/lib/supabase'
import type { Language, Translations } from '@/app/page'

Chart.register(...registerables)

interface SiteDashboardProps {
  language: Language
  translations: Translations
}

// Sample data - in production this would come from Supabase
const sampleSiteData = {
  name: 'PKM Kramat Jati',
  district: 'East Jakarta',
  province: 'DKI Jakarta',
  siteType: 'Puskesmas',
  patientsOnTreatment: 342,
  mentor: 'Dewi Suryani',
  currentPathway: 'rationalization',
  currentQuarter: '2025-Q1',
  performance: {
    '1.1': 92,
    '2.1': 65,
    '3.1': 78,
    '4.1': 87,
    '5.1': 58,
    '6.1': 82,
  },
  pathwayHistory: [
    { quarter: 'Q1 \'24', pathway: 'prioritization' },
    { quarter: 'Q2 \'24', pathway: 'prioritization' },
    { quarter: 'Q3 \'24', pathway: 'rationalization' },
    { quarter: 'Q4 \'24', pathway: 'rationalization' },
    { quarter: 'Q1 \'25', pathway: 'rationalization', current: true },
  ],
  supportHistory: [
    { quarter: 'Q2 \'24', hours: 12 },
    { quarter: 'Q3 \'24', hours: 9 },
    { quarter: 'Q4 \'24', hours: 7.5 },
    { quarter: 'Q1 \'25', hours: 6.5, current: true },
  ],
  currentSupport: [
    { modality: 'face-to-face', name: 'Face-to-face mentoring', hours: 3.5, icon: '🧑‍🏫' },
    { modality: 'remote', name: 'Remote support', hours: 1.5, icon: '📱' },
    { modality: 'data-review', name: 'Data review session', hours: 1.5, icon: '📊' },
  ],
  rootCauses: [
    { id: 'staffing', status: 'active', quarters: 4 },
    { id: 'me-data', status: 'active', note: 'New Q1 \'25' },
    { id: 'capacity', status: 'resolved', resolvedQuarter: 'Q4 \'24' },
    { id: 'supply-chain', status: 'resolved', resolvedQuarter: 'Q3 \'24' },
  ],
  indicatorsAtTargetHistory: [1, 2, 2, 3],
}

// PATHWAY COLORS - Blues palette (journey/progression)
const pathwayColors: Record<string, string> = {
  'prioritization': '#0D47A1',
  'rationalization': '#1976D2',
  'transition-ready': '#42A5F5',
  'graduation': '#81D4FA',
  're-engagement': '#5C6BC0',
}

const pathwayAbbrev: Record<string, string> = {
  'prioritization': 'PRI',
  'rationalization': 'RAT',
  'transition-ready': 'TRA',
  'graduation': 'GRA',
  're-engagement': 'REE',
}

// ROOT CAUSE COLORS - Purples palette (challenges)
const rootCauseColors: Record<string, { main: string; light: string }> = {
  'staffing': { main: '#6A1B9A', light: '#F3E5F5' },
  'capacity': { main: '#7B1FA2', light: '#F3E5F5' },
  'me-data': { main: '#8E24AA', light: '#F3E5F5' },
  'supply-chain': { main: '#9C27B0', light: '#F3E5F5' },
  'policy-sops': { main: '#AB47BC', light: '#F3E5F5' },
  'service-delivery': { main: '#BA68C8', light: '#F3E5F5' },
  'patient-factors': { main: '#CE93D8', light: '#F3E5F5' },
  'leadership': { main: '#E1BEE7', light: '#F3E5F5' },
}

// SUPPORT MODALITY COLORS - Teals palette (helping activities)
const supportColors: Record<string, string> = {
  'face-to-face': '#00695C',
  'remote': '#00897B',
  'data-review': '#26A69A',
  'training': '#4DB6AC',
  'peer-learning': '#80CBC4',
  'sop-development': '#B2DFDB',
}

const statusColors: Record<PerformanceStatus, string> = {
  'optimal': 'from-green-600 to-status-optimal',
  'effective': 'from-lime-500 to-status-effective',
  'improving': 'from-amber-400 to-status-improving',
  'sub-improving': 'from-orange-400 to-status-sub',
  'stressed': 'from-red-400 to-status-stressed',
}

const targetPositions: Record<string, number> = {
  '1.1': 95,
  '2.1': 80,
  '3.1': 80,
  '4.1': 98,
  '5.1': 75,
  '6.1': 86,
}

export default function SiteDashboard({ language, translations: t }: SiteDashboardProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      chartInstance.current = new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: ['Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025'],
          datasets: [{
            label: 'Indicators at Optimal/Effective',
            data: sampleSiteData.indicatorsAtTargetHistory,
            backgroundColor: [
              'rgba(230, 57, 70, 0.8)',
              'rgba(255, 167, 38, 0.8)',
              'rgba(255, 167, 38, 0.8)',
              'rgba(124, 179, 66, 0.8)'
            ],
            borderRadius: 6,
            barThickness: 50
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => context.raw + ' of 6 indicators at target'
              }
            }
          },
          scales: {
            y: {
              min: 0,
              max: 6,
              ticks: {
                stepSize: 1,
                callback: (v) => v + ' / 6'
              },
              grid: { color: 'rgba(0,0,0,0.05)' }
            },
            x: {
              grid: { display: false }
            }
          }
        }
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  const indicatorsAtTarget = Object.entries(sampleSiteData.performance).filter(([key, value]) => {
    const status = getIndicatorStatus(key, value)
    return status === 'optimal' || status === 'effective'
  }).length

  const quartersAtCurrentPathway = sampleSiteData.pathwayHistory.filter(
    h => h.pathway === sampleSiteData.currentPathway
  ).length

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Dashboard Header */}
      <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-epic-navy">{sampleSiteData.name}</h2>
          <div className="text-sm text-gray-500 mt-1 space-x-4">
            <span>📍 {sampleSiteData.district}, {sampleSiteData.province}</span>
            <span>🏥 {sampleSiteData.siteType}</span>
            <span>👥 {sampleSiteData.patientsOnTreatment} patients on treatment</span>
            <span>👤 Mentor: {sampleSiteData.mentor}</span>
          </div>
        </div>
        <div 
          className="px-5 py-2 rounded-lg text-sm font-bold text-white uppercase tracking-wide"
          style={{ background: `linear-gradient(135deg, ${pathwayColors[sampleSiteData.currentPathway]}, ${pathwayColors[sampleSiteData.currentPathway]}dd)` }}
        >
          {PATHWAYS[sampleSiteData.currentPathway as keyof typeof PATHWAYS].name}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Indicators at Target */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Indicators at Target</span>
            <span className="text-xs text-epic-primary">{sampleSiteData.currentQuarter}</span>
          </div>
          <div className="flex items-center justify-center py-4">
            <div className="flex gap-2 mr-6">
              {Object.entries(sampleSiteData.performance).map(([key, value]) => {
                const status = getIndicatorStatus(key, value)
                const isAtTarget = status === 'optimal' || status === 'effective'
                return (
                  <div 
                    key={key}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                      isAtTarget ? 'bg-gradient-to-br from-status-optimal to-status-effective' : 'bg-gray-300'
                    }`}
                  >
                    {key}
                  </div>
                )
              })}
            </div>
            <div>
              <div className="text-4xl font-bold text-epic-navy">
                {indicatorsAtTarget} <span className="text-2xl text-gray-400">/ 6</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">at Optimal or Effective</div>
              <div className="flex items-center gap-1 mt-2 text-sm font-semibold text-status-optimal">
                <span>▲</span> +1 from Q4 2024
              </div>
            </div>
          </div>
        </div>

        {/* Pathway Progression */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pathway Progression</span>
            <span className="text-xs text-epic-primary">Last 5 Quarters</span>
          </div>
          <div className="relative flex items-center justify-between py-5 px-10">
            <div className="absolute top-1/2 left-10 right-10 h-1 bg-epic-light-blue -translate-y-1/2 z-0"></div>
            {sampleSiteData.pathwayHistory.map((h, i) => (
              <div key={i} className="flex flex-col items-center z-10">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold text-white border-3 border-white shadow-md ${h.current ? 'scale-110' : ''}`}
                  style={{ backgroundColor: pathwayColors[h.pathway] }}
                >
                  {pathwayAbbrev[h.pathway]}
                </div>
                <div className={`text-xs mt-2 ${h.current ? 'font-bold text-epic-navy' : 'text-gray-500'}`}>
                  {h.quarter}
                </div>
                {h.current && <div className="text-[10px] text-gray-400">Current</div>}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-full text-sm font-semibold text-status-improving">
              ⏱️ {quartersAtCurrentPathway} quarters at {PATHWAYS[sampleSiteData.currentPathway as keyof typeof PATHWAYS].name} — review for Transition-Ready eligibility
            </div>
          </div>
        </div>

        {/* Indicator Performance */}
        <div className="col-span-12 lg:col-span-7 bg-white rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Indicator Performance</span>
            <span className="text-xs text-epic-primary">vs Target</span>
          </div>
          <div className="space-y-3">
            {Object.entries(sampleSiteData.performance).map(([key, value]) => {
              const status = getIndicatorStatus(key, value)
              const target = targetPositions[key]
              const shortName = INDICATOR_NAMES[key as keyof typeof INDICATOR_NAMES].split(' ')[0]
              
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-10 text-sm font-semibold text-epic-navy">{key}</span>
                  <span className="w-24 text-xs text-gray-500 truncate">{shortName}</span>
                  <div className="flex-1 h-7 bg-gray-100 rounded-md relative overflow-hidden">
                    <div 
                      className={`h-full rounded-md bg-gradient-to-r ${status ? statusColors[status] : ''} flex items-center justify-end pr-2 transition-all`}
                      style={{ width: `${value}%` }}
                    >
                      <span className="text-xs font-bold text-white drop-shadow">{value}%</span>
                    </div>
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-epic-navy"
                      style={{ left: `${target}%` }}
                    >
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] text-epic-navy">▼</span>
                    </div>
                  </div>
                  <span className="w-6 text-center">
                    {key === '2.1' ? (
                      <span className="text-status-stressed">▼</span>
                    ) : key === '4.1' ? (
                      <span className="text-gray-400">●</span>
                    ) : (
                      <span className="text-status-optimal">▲</span>
                    )}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="flex justify-center gap-5 mt-4 text-xs flex-wrap">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-status-optimal"></div> Optimal</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-status-effective"></div> Effective</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-status-improving"></div> Improving</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-status-stressed"></div> Stressed</div>
            <div className="flex items-center gap-1.5 text-gray-500">▼ Target</div>
          </div>
        </div>

        {/* Support History */}
        <div className="col-span-12 lg:col-span-5 bg-white rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Technical Support</span>
            <span className="text-xs text-epic-primary">Quarterly Trend</span>
          </div>
          <div className="flex gap-3 mb-4">
            {sampleSiteData.supportHistory.map((s, i) => (
              <div 
                key={i} 
                className={`flex-1 text-center p-3 rounded-lg ${s.current ? 'bg-epic-light-blue border-2 border-epic-primary' : 'bg-gray-50'}`}
              >
                <div className="text-[10px] text-gray-500 mb-1">{s.quarter}</div>
                <div className="text-xl font-bold text-epic-navy">{s.hours}</div>
                <div className="text-[10px] text-gray-500">hours</div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 py-2 px-3 bg-gray-50 rounded-md text-sm text-status-optimal">
            📉 Support decreasing as performance improves (-46% since Q2 '24)
          </div>
          <div className="mt-4 space-y-2">
            {sampleSiteData.currentSupport.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div 
                  className="w-7 h-7 rounded-md flex items-center justify-center text-sm text-white"
                  style={{ backgroundColor: supportColors[s.modality] || '#00897B' }}
                >
                  {s.icon}
                </div>
                <span className="flex-1 text-xs text-epic-navy">{s.name}</span>
                <span className="text-sm font-bold text-epic-navy">{s.hours} hrs</span>
              </div>
            ))}
          </div>
        </div>

        {/* Root Cause History */}
        <div className="col-span-12 lg:col-span-5 bg-white rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Root Causes</span>
            <span className="text-xs text-epic-primary">History</span>
          </div>
          <div className="space-y-2">
            {ROOT_CAUSES.map(rc => {
              const data = sampleSiteData.rootCauses.find(r => r.id === rc.id)
              const status = data?.status || 'inactive'
              const colors = rootCauseColors[rc.id]
              
              return (
                <div 
                  key={rc.id}
                  className={`flex items-center gap-3 p-2.5 rounded-lg ${
                    status === 'inactive' ? 'bg-gray-50' : ''
                  }`}
                  style={status !== 'inactive' ? { backgroundColor: colors?.light || '#F3E5F5' } : {}}
                >
                  <span className="text-base">{rc.icon}</span>
                  <span 
                    className={`flex-1 text-sm font-medium ${status === 'inactive' ? 'text-gray-300' : ''}`}
                    style={status !== 'inactive' ? { color: colors?.main || '#7B1FA2' } : {}}
                  >
                    {rc.name}
                  </span>
                  {data?.status === 'active' && data.quarters && (
                    <span 
                      className="px-2 py-0.5 rounded text-[10px] font-semibold text-white"
                      style={{ backgroundColor: colors?.main || '#7B1FA2' }}
                    >
                      {data.quarters} quarters
                    </span>
                  )}
                  {data?.status === 'active' && data.note && (
                    <span 
                      className="px-2 py-0.5 rounded text-[10px] font-semibold text-white"
                      style={{ backgroundColor: colors?.main || '#7B1FA2' }}
                    >
                      {data.note}
                    </span>
                  )}
                  {data?.status === 'resolved' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-status-optimal text-white">
                      Resolved {data.resolvedQuarter}
                    </span>
                  )}
                  {!data && (
                    <span className="text-[10px] text-gray-400">Never identified</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Performance Trend Chart */}
        <div className="col-span-12 lg:col-span-7 bg-white rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Performance Trend</span>
            <span className="text-xs text-epic-primary">Indicators at Target Over Time</span>
          </div>
          <div className="h-52">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
      </div>
    </div>
  )
}
