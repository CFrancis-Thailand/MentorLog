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
import { getSiteById, SITES, PROVINCES, getDistrictsByProvince, type Site } from '@/lib/sites'
import type { Language, Translations } from '@/app/page'

Chart.register(...registerables)

interface SiteDashboardProps {
  language: Language
  translations: Translations
  selectedSiteId?: number | null
}

// Sample data — in production this would come from Supabase
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

// PATHWAY COLORS — Blues palette (journey/progression)
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

// ROOT CAUSE COLORS — Purples palette (challenges)
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

// SUPPORT MODALITY COLORS — Teals palette (helping activities)
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

export default function SiteDashboard({ language, translations: t, selectedSiteId }: SiteDashboardProps) {
  // Site selection for dashboard
  const [dashboardSiteId, setDashboardSiteId] = useState<number>(1)
  const dashboardSite = getSiteById(dashboardSiteId)

  // Build display data from selected site
  const displaySiteData = dashboardSite ? {
    ...sampleSiteData,
    name: dashboardSite.name,
    district: dashboardSite.district,
    province: dashboardSite.province,
    siteType: dashboardSite.facilityType,
  } : sampleSiteData

  const selectedSite = selectedSiteId ? getSiteById(selectedSiteId) : null
  const activeSiteData = selectedSite ? { ...sampleSiteData, name: selectedSite.name, district: selectedSite.district, province: selectedSite.province, siteType: selectedSite.facilityType } : displaySiteData

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
            label: t.indicatorsAtTargetLabel || 'Indicators at Optimal/Effective',
            data: activeSiteData.indicatorsAtTargetHistory,
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
                label: (context) => context.raw + ' ' + (t.ofSixIndicators || 'of 6 indicators at target')
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
