import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for our database
export interface Site {
  id: string
  name: string
  site_type: 'puskesmas' | 'hospital' | 'private' | 'community'
  district_id: string
  province: string
  patients_on_treatment: number
  current_pathway: 'prioritization' | 'rationalization' | 'transition-ready' | 'graduation' | 're-engagement'
  assigned_mentor_id: string | null
  created_at: string
  updated_at: string
}

export interface District {
  id: string
  name: string
  province: string
  created_at: string
}

export interface Mentor {
  id: string
  name: string
  phone: string
  mentor_type: 'district' | 'provincial' | 'national'
  district_id: string | null
  created_at: string
}

export interface QuarterlyPerformance {
  id: string
  site_id: string
  quarter: string // e.g., "2025-Q1"
  indicator_1_1: number | null
  indicator_2_1: number | null
  indicator_3_1: number | null
  indicator_4_1: number | null
  indicator_5_1: number | null
  indicator_6_1: number | null
  pathway_assignment: string
  patients_on_treatment: number
  created_at: string
  created_by: string | null
}

export interface SupportLog {
  id: string
  site_id: string
  mentor_id: string
  quarter: string
  support_date: string
  modality: 'face-to-face' | 'remote' | 'data-review' | 'training' | 'peer-learning' | 'sop-development'
  duration_minutes: number
  indicators_addressed: string[] // e.g., ["1.1", "4.1"]
  root_causes_identified: string[]
  notes: string | null
  created_at: string
}

export interface RootCauseLog {
  id: string
  site_id: string
  quarter: string
  root_cause: 'staffing' | 'capacity' | 'me-data' | 'supply-chain' | 'policy-sops' | 'service-delivery' | 'patient-factors' | 'leadership'
  status: 'active' | 'resolved'
  identified_date: string
  resolved_date: string | null
  created_at: string
}

// Performance threshold definitions from Sustainable Excellence
export const THRESHOLDS = {
  '1.1': { optimal: 95, effective: 90, improving: 85, sub: 80 },
  '2.1': { optimal: 80, effective: 70, improving: 60, sub: 50 },
  '3.1': { optimal: 80, effective: 70, improving: 60, sub: 50 },
  '4.1': { optimal: 98, effective: 96, improving: 92, sub: 90 },
  '5.1': { optimal: 75, effective: 65, improving: 55, sub: 45 },
  '6.1': { optimal: 86, effective: 80, improving: 75, sub: 70 },
}

export const INDICATOR_NAMES = {
  '1.1': 'HIV Testing and Service Enrollment',
  '2.1': 'ART Initiation',
  '3.1': 'Advanced HIV Disease (CD4 Testing)',
  '4.1': 'Treatment Continuity',
  '5.1': 'Multi-Month Dispensing (MMD)',
  '6.1': 'Viral Load Testing',
}

export const INDICATOR_DESCRIPTIONS = {
  '1.1': 'Percentage of newly diagnosed PLHIV enrolled in HIV treatment services',
  '2.1': 'Percentage of enrolled PLHIV that initiate ART within 1-7 days',
  '3.1': 'Percentage of newly enrolled PLHIV that receive baseline CD4 testing',
  '4.1': 'Percentage of current-on-treatment PLHIV that continue treatment',
  '5.1': 'Percentage of eligible PLHIV that receive multi-month dispensing (3-6 months)',
  '6.1': 'Percentage of eligible PLHIV (≥6 months on ART) that receive viral load testing',
}

export type PerformanceStatus = 'optimal' | 'effective' | 'improving' | 'sub-improving' | 'stressed'

export function getIndicatorStatus(indicator: string, value: number | null): PerformanceStatus | null {
  if (value === null || value === undefined) return null
  
  const t = THRESHOLDS[indicator as keyof typeof THRESHOLDS]
  if (!t) return null
  
  if (value > t.optimal) return 'optimal'
  if (value >= t.effective) return 'effective'
  if (value >= t.improving) return 'improving'
  if (value >= t.sub) return 'sub-improving'
  return 'stressed'
}

export function countIndicatorsAtTarget(performance: QuarterlyPerformance): number {
  const indicators = ['1.1', '2.1', '3.1', '4.1', '5.1', '6.1']
  let count = 0
  
  indicators.forEach(ind => {
    const key = `indicator_${ind.replace('.', '_')}` as keyof QuarterlyPerformance
    const value = performance[key] as number | null
    const status = getIndicatorStatus(ind, value)
    if (status === 'optimal' || status === 'effective') {
      count++
    }
  })
  
  return count
}

// PATHWAYS - Blues palette (journey/progression metaphor)
export const PATHWAYS = {
  'prioritization': {
    name: 'Prioritization',
    description: 'Intensive weekly support',
    color: '#0D47A1', // Dark blue - most intensive
    colorLight: '#E3F2FD',
    contactFrequency: 'Weekly'
  },
  'rationalization': {
    name: 'Rationalization', 
    description: 'Targeted monthly support',
    color: '#1976D2', // Medium blue
    colorLight: '#BBDEFB',
    contactFrequency: 'Monthly'
  },
  'transition-ready': {
    name: 'Transition-Ready',
    description: 'Light-touch quarterly support',
    color: '#42A5F5', // Sky blue
    colorLight: '#E1F5FE',
    contactFrequency: 'Quarterly'
  },
  'graduation': {
    name: 'Graduation',
    description: 'On-request support only',
    color: '#81D4FA', // Light blue - graduated/light touch
    colorLight: '#E0F7FA',
    contactFrequency: 'On-request'
  },
  're-engagement': {
    name: 'Re-engagement',
    description: 'Time-limited targeted support',
    color: '#5C6BC0', // Indigo - special case, stands out
    colorLight: '#E8EAF6',
    contactFrequency: 'Weekly (time-limited)'
  },
}

// ROOT CAUSES - Purples/Violets palette (challenges to address)
export const ROOT_CAUSES = [
  { id: 'staffing', name: 'Staffing', icon: '👤', color: '#6A1B9A', colorLight: '#F3E5F5' },
  { id: 'capacity', name: 'Capacity', icon: '📈', color: '#7B1FA2', colorLight: '#F3E5F5' },
  { id: 'me-data', name: 'M&E / Data', icon: '📋', color: '#8E24AA', colorLight: '#F3E5F5' },
  { id: 'supply-chain', name: 'Supply Chain', icon: '📦', color: '#9C27B0', colorLight: '#F3E5F5' },
  { id: 'policy-sops', name: 'Policy / SOPs', icon: '📜', color: '#AB47BC', colorLight: '#F3E5F5' },
  { id: 'service-delivery', name: 'Service Delivery', icon: '🏥', color: '#BA68C8', colorLight: '#F3E5F5' },
  { id: 'patient-factors', name: 'Patient Factors', icon: '👥', color: '#CE93D8', colorLight: '#F3E5F5' },
  { id: 'leadership', name: 'Leadership', icon: '👔', color: '#E1BEE7', colorLight: '#F3E5F5' },
]

// SUPPORT MODALITIES - Teals palette (helping/healing activities)
export const SUPPORT_MODALITIES = [
  { id: 'face-to-face', name: 'Face-to-face mentoring', icon: '🧑‍🏫', color: '#00695C', colorLight: '#E0F2F1' },
  { id: 'remote', name: 'Remote support (WhatsApp/phone)', icon: '📱', color: '#00897B', colorLight: '#E0F2F1' },
  { id: 'data-review', name: 'Data review session', icon: '📊', color: '#26A69A', colorLight: '#E0F2F1' },
  { id: 'training', name: 'Targeted training', icon: '🎓', color: '#4DB6AC', colorLight: '#E0F2F1' },
  { id: 'peer-learning', name: 'Peer learning facilitation', icon: '🤝', color: '#80CBC4', colorLight: '#E0F2F1' },
  { id: 'sop-development', name: 'SOP/tool development', icon: '📝', color: '#B2DFDB', colorLight: '#E0F2F1' },
]
