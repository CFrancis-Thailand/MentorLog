'use client'

import { useState } from 'react'
import SiteDashboard from '@/components/SiteDashboard'
import DistrictDashboard from '@/components/DistrictDashboard'
import QuarterlyEntry from '@/components/QuarterlyEntry'

// Translations
const translations = {
  en: {
    // Header
    appName: 'MentorLog',
    tagline: 'Catatan Pendamping • EpiC Indonesia',
    
    // Tabs
    tabQuarterlyEntry: 'Quarterly Entry',
    tabSiteDashboard: 'Site Dashboard',
    tabDistrictDashboard: 'District Dashboard',
    
    // Quarterly Entry
    quarterlyEntryTitle: 'Quarterly Performance Entry',
    selectSite: 'Select Site',
    selectQuarter: 'Select Quarter',
    siteType: 'Site Type',
    patientsOnTreatment: 'Patients on Treatment',
    performanceIndicators: 'Performance Indicators',
    showThresholds: 'Show Thresholds',
    hideThresholds: 'Hide Thresholds',
    pathwayAssignment: 'Pathway Assignment',
    selectPathway: 'Select pathway based on performance...',
    assignedMentor: 'Assigned Mentor',
    selectMentor: 'Select mentor...',
    saveEntry: 'Save Quarterly Entry',
    thresholdReference: 'Threshold Reference',
    indicator: 'Indicator',
    target: 'Target',
    enterValue: 'Enter %',
    
    // Site types
    puskesmas: 'Puskesmas',
    hospital: 'Hospital',
    privateClinic: 'Private Clinic',
    communityBased: 'Community-Based',
    
    // Indicators
    ind_1_1: 'Enrollment',
    ind_2_1: 'ART Initiation',
    ind_3_1: 'CD4 Testing',
    ind_4_1: 'Treatment Continuity',
    ind_5_1: 'Multi-Month Dispensing',
    ind_6_1: 'Viral Load Testing',
    
    ind_1_1_desc: 'New HIV+ enrolled in care within 7 days',
    ind_2_1_desc: 'New enrollees initiated on ART within 7 days',
    ind_3_1_desc: 'New ART patients with CD4 test within 14 hari',
    ind_4_1_desc: 'Patients retained on ART at 12 months',
    ind_5_1_desc: 'Eligible patients on 3+ month dispensing',
    ind_6_1_desc: 'Eligible patients with VL test in past 12 months',
    
    // Status labels
    optimal: 'Optimal',
    effective: 'Effective',
    improving: 'Improving',
    subImproving: 'Sub',
    stressed: 'Stressed',
    
    // Pathways
    prioritization: 'Prioritization',
    rationalization: 'Rationalization',
    transitionReady: 'Transition-Ready',
    graduation: 'Graduation',
    reengagement: 'Re-engagement',
    
    prioritizationDesc: 'Fewer than four indicators at Optimal/Effective; intensive biweekly or monthly support',
    rationalizationDesc: 'Four or more indicators at Optimal/Effective over past quarter; targeted monthly or quarterly support',
    transitionReadyDesc: 'Four or more indicators at Optimal/Effective over 3 consecutive quarters; light-touch quarterly support',
    graduationDesc: 'Facilities operating independently with sustained high performance; on request technical support',
    reengagementDesc: 'Previously transitioned or graduated facilities experiencing performance decline; time-limited targeted support',
    
    // Site Dashboard
    siteDashboardTitle: 'Site Performance Dashboard',
    indicatorsAtTarget: 'Indicators at Target',
    currentPathway: 'Current Pathway',
    pathwayProgression: 'Pathway Progression',
    indicatorPerformance: 'Indicator Performance',
    supportThisQuarter: 'Support This Quarter',
    totalHours: 'Total Hours',
    supportHistory: 'Support History (hrs/quarter)',
    rootCauseTracking: 'Root Cause Tracking',
    performanceTrend: 'Performance Trend',
    indicatorsAtTargetLabel: 'Indicators at Optimal/Effective',
    quarters: 'quarters',
    resolved: 'Resolved',
    neverIdentified: 'Never identified',
    
    // District Dashboard
    districtDashboardTitle: 'District Overview Dashboard',
    totalSites: 'Total Sites',
    meetingTargets: 'meeting ≥4 indicators',
    mentorsCovering: 'mentors covering',
    avgHoursPerSite: 'avg hrs/site this quarter',
    pathwayDistribution: 'Pathway Distribution',
    performanceByFacilityType: 'Performance by Facility Type',
    rootCausesAcrossDistrict: 'Root Causes Across District',
    sitesAffected: 'sites affected',
    supportDelivered: 'Support Delivered This Quarter',
    totalHoursDelivered: 'total hours',
    mentorActivity: 'Mentor Activity',
    sites: 'sites',
    hours: 'hours',
    systemLevelEscalations: 'System-Level Escalations',
    active: 'Active',
    subOptimal: 'sub-optimal',
    
    // Root causes
    staffing: 'Staffing',
    capacity: 'Capacity',
    meData: 'M&E / Data',
    supplyChain: 'Supply Chain',
    policySops: 'Policy / SOPs',
    serviceDelivery: 'Service Delivery',
    patientFactors: 'Patient Factors',
    leadership: 'Leadership',
    
    // Support modalities
    faceToFace: 'Face-to-face mentoring',
    remote: 'Remote support',
    dataReview: 'Data review session',
    training: 'Targeted training',
    peerLearning: 'Peer learning facilitation',
    sopDevelopment: 'SOP/tool development',

    // Footer
    footer: 'MentorLog v1.0 | EpiC Indonesia | Sustainable Excellence Framework',
  },
  id: {
    // Header
    appName: 'MentorLog',
    tagline: 'Catatan Pendamping • EpiC Indonesia',
    
    // Tabs
    tabQuarterlyEntry: 'Entri Kuartalan',
    tabSiteDashboard: 'Dasbor Fasilitas',
    tabDistrictDashboard: 'Dasbor Kabupaten',
    
    // Quarterly Entry
    quarterlyEntryTitle: 'Entri Kinerja Kuartalan',
    selectSite: 'Pilih Fasilitas',
    selectQuarter: 'Pilih Kuartal',
    siteType: 'Jenis Fasilitas',
    patientsOnTreatment: 'Pasien dalam Pengobatan',
    performanceIndicators: 'Indikator Kinerja',
    showThresholds: 'Tampilkan Ambang Batas',
    hideThresholds: 'Sembunyikan Ambang Batas',
    pathwayAssignment: 'Penugasan Jalur',
    selectPathway: 'Pilih jalur berdasarkan kinerja...',
    assignedMentor: 'Pendamping Ditugaskan',
    selectMentor: 'Pilih pendamping...',
    saveEntry: 'Simpan Entri Kuartalan',
    thresholdReference: 'Referensi Ambang Batas',
    indicator: 'Indikator',
    target: 'Target',
    enterValue: 'Masukkan %',
    
    // Site types
    puskesmas: 'Puskesmas',
    hospital: 'Rumah Sakit',
    privateClinic: 'Klinik Swasta',
    communityBased: 'Berbasis Komunitas',
    
    // Indicators
    ind_1_1: 'Pendaftaran',
    ind_2_1: 'Inisiasi ART',
    ind_3_1: 'Tes CD4',
    ind_4_1: 'Kontinuitas Pengobatan',
    ind_5_1: 'Pemberian Obat Multi-Bulan',
    ind_6_1: 'Tes Viral Load',
    
    ind_1_1_desc: 'HIV+ baru terdaftar dalam perawatan dalam 7 hari',
    ind_2_1_desc: 'Pendaftar baru memulai ART dalam 7 hari',
    ind_3_1_desc: 'Pasien ART baru dengan tes CD4 dalam 14 hari',
    ind_4_1_desc: 'Pasien tetap dalam ART pada 12 bulan',
    ind_5_1_desc: 'Pasien yang memenuhi syarat dengan pemberian 3+ bulan',
    ind_6_1_desc: 'Pasien yang memenuhi syarat dengan tes VL dalam 12 bulan terakhir',
    
    // Status labels
    optimal: 'Optimal',
    effective: 'Efektif',
    improving: 'Meningkat',
    subImproving: 'Sub',
    stressed: 'Tertekan',
    
    // Pathways
    prioritization: 'Prioritas',
    rationalization: 'Rasionalisasi',
    transitionReady: 'Siap Transisi',
    graduation: 'Graduasi',
    reengagement: 'Re-engagement',
    
    prioritizationDesc: 'Kurang dari empat indikator pada Optimal/Efektif; dukungan intensif dua mingguan atau bulanan',
    rationalizationDesc: 'Empat atau lebih indikator pada Optimal/Efektif selama kuartal lalu; dukungan terarah bulanan atau kuartalan',
    transitionReadyDesc: 'Empat atau lebih indikator pada Optimal/Efektif selama 3 kuartal berturut-turut; dukungan ringan kuartalan',
    graduationDesc: 'Fasilitas beroperasi mandiri dengan kinerja tinggi berkelanjutan; dukungan teknis sesuai permintaan',
    reengagementDesc: 'Fasilitas yang sebelumnya transisi atau graduasi mengalami penurunan kinerja; dukungan terarah terbatas waktu',
    
    // Site Dashboard
    siteDashboardTitle: 'Dasbor Kinerja Fasilitas',
    indicatorsAtTarget: 'Indikator Mencapai Target',
    currentPathway: 'Jalur Saat Ini',
    pathwayProgression: 'Progres Jalur',
    indicatorPerformance: 'Kinerja Indikator',
    supportThisQuarter: 'Dukungan Kuartal Ini',
    totalHours: 'Total Jam',
    supportHistory: 'Riwayat Dukungan (jam/kuartal)',
    rootCauseTracking: 'Pelacakan Akar Masalah',
    performanceTrend: 'Tren Kinerja',
    indicatorsAtTargetLabel: 'Indikator di Optimal/Efektif',
    quarters: 'kuartal',
    resolved: 'Terselesaikan',
    neverIdentified: 'Tidak pernah teridentifikasi',
    
    // District Dashboard
    districtDashboardTitle: 'Dasbor Ringkasan Kabupaten',
    totalSites: 'Total Fasilitas',
    meetingTargets: 'memenuhi ≥4 indikator',
    mentorsCovering: 'pendamping melayani',
    avgHoursPerSite: 'rata-rata jam/fasilitas kuartal ini',
    pathwayDistribution: 'Distribusi Jalur',
    performanceByFacilityType: 'Kinerja per Jenis Fasilitas',
    rootCausesAcrossDistrict: 'Akar Masalah di Kabupaten',
    sitesAffected: 'fasilitas terdampak',
    supportDelivered: 'Dukungan Diberikan Kuartal Ini',
    totalHoursDelivered: 'total jam',
    mentorActivity: 'Aktivitas Pendamping',
    sites: 'fasilitas',
    hours: 'jam',
    systemLevelEscalations: 'Eskalasi Tingkat Sistem',
    active: 'Aktif',
    subOptimal: 'sub-optimal',
    
    // Root causes
    staffing: 'Kepegawaian',
    capacity: 'Kapasitas',
    meData: 'M&E / Data',
    supplyChain: 'Rantai Pasokan',
    policySops: 'Kebijakan / SOP',
    serviceDelivery: 'Penyampaian Layanan',
    patientFactors: 'Faktor Pasien',
    leadership: 'Kepemimpinan',
    
    // Support modalities
    faceToFace: 'Pendampingan tatap muka',
    remote: 'Dukungan jarak jauh',
    dataReview: 'Sesi review data',
    training: 'Pelatihan terarah',
    peerLearning: 'Fasilitasi pembelajaran sebaya',
    sopDevelopment: 'Pengembangan SOP/alat',

    // Footer
    footer: 'MentorLog v1.0 | EpiC Indonesia | Kerangka Keunggulan Berkelanjutan',
  }
}

export type Language = 'en' | 'id'
export type Translations = typeof translations.en

type Tab = 'entry' | 'site' | 'district'

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('entry')
  const [language, setLanguage] = useState<Language>('en')

  const t = translations[language]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-epic-navy to-[#2a4a6b] text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">{t.appName}</h1>
            <p className="text-sm opacity-85">{t.tagline}</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  language === 'en'
                    ? 'bg-white text-epic-navy'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('id')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  language === 'id'
                    ? 'bg-white text-epic-navy'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                ID
              </button>
            </div>

            {/* Navigation Tabs - Quarterly Entry First */}
            <nav className="flex gap-1">
              <button
                onClick={() => setActiveTab('entry')}
                className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'entry' 
                    ? 'bg-epic-primary' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {t.tabQuarterlyEntry}
              </button>
              <button
                onClick={() => setActiveTab('site')}
                className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'site' 
                    ? 'bg-epic-primary' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {t.tabSiteDashboard}
              </button>
              <button
                onClick={() => setActiveTab('district')}
                className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'district' 
                    ? 'bg-epic-primary' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {t.tabDistrictDashboard}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {activeTab === 'entry' && <QuarterlyEntry language={language} translations={t} />}
        {activeTab === 'site' && <SiteDashboard language={language} translations={t} />}
        {activeTab === 'district' && <DistrictDashboard language={language} translations={t} />}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        {t.footer}
      </footer>
    </div>
  )
}
