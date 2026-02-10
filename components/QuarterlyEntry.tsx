'use client'

import { useState, useEffect } from 'react'
import { 
  THRESHOLDS, 
  PATHWAYS,
  getIndicatorStatus,
  type PerformanceStatus 
} from '@/lib/supabase'
import {
  SITES,
  PROVINCES,
  getDistrictsByProvince,
  getFacilityTypes,
  getFilteredSites,
  getSiteById,
  type Site
} from '@/lib/sites'
import type { Language, Translations } from '@/app/page'

interface QuarterlyEntryProps {
  language: Language
  translations: Translations
  onSiteSelect?: (id: number | null) => void
}

interface IndicatorValue {
  value: string
  status: PerformanceStatus | null
  isNA: boolean
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

export default function QuarterlyEntry({ language, translations: t, onSiteSelect }: QuarterlyEntryProps) {
  // Site selection filters
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedFacilityType, setSelectedFacilityType] = useState('')
  const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null)
  
  // Derived filter options
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([])
  const [availableFacilityTypes, setAvailableFacilityTypes] = useState<string[]>([])
  const [availableSites, setAvailableSites] = useState<Site[]>([])
  
  // Other form fields
  const [selectedFYQuarter, setSelectedFYQuarter] = useState('Q2') // Default to current quarter
  const [selectedFY, setSelectedFY] = useState('26') // Default to FY26
  const [patientCount, setPatientCount] = useState('')
  const [selectedPathway, setSelectedPathway] = useState('')
  const [selectedMentors, setSelectedMentors] = useState<string[]>([])
  const [showThresholds, setShowThresholds] = useState(false)
  
  // Mentor management
  const [mentors, setMentors] = useState([
    { id: 'aulia', name: 'Aulia Human' },
    { id: 'kurnia', name: 'Kurnia Baraq' },
    { id: 'dian', name: 'Dian Agrianti' },
    { id: 'tubagus', name: 'Tubagus Rohman' },
    { id: 'eugenia', name: 'Eugenia Jasmine' },
    { id: 'gladys', name: 'Gladys Octavia' },
    { id: 'chaterine', name: 'Chaterine Tauran' },
  ])
  const [showAddMentor, setShowAddMentor] = useState(false)
  const [newMentorName, setNewMentorName] = useState('')
  
  const handleMentorToggle = (mentorId: string) => {
    setSelectedMentors(prev => 
      prev.includes(mentorId)
        ? prev.filter(id => id !== mentorId)
        : [...prev, mentorId]
    )
  }
  
  const handleAddMentor = () => {
    if (newMentorName.trim()) {
      const newId = newMentorName.toLowerCase().replace(/\s+/g, '-')
      setMentors(prev => [...prev, { id: newId, name: newMentorName.trim() }])
      setSelectedMentors(prev => [...prev, newId])
      setNewMentorName('')
      setShowAddMentor(false)
    }
  }
  
  const [indicators, setIndicators] = useState<Record<string, IndicatorValue>>({
    '1.1': { value: '', status: null, isNA: false },
    '2.1': { value: '', status: null, isNA: false },
    '3.1': { value: '', status: null, isNA: false },
    '4.1': { value: '', status: null, isNA: false },
    '5.1': { value: '', status: null, isNA: false },
    '6.1': { value: '', status: null, isNA: false },
  })

  // Update available districts when province changes
  useEffect(() => { if (onSiteSelect) onSiteSelect(selectedSiteId) }, [selectedSiteId])

  useEffect(() => {
    if (selectedProvince) {
      setAvailableDistricts(getDistrictsByProvince(selectedProvince))
    } else {
      setAvailableDistricts([])
    }
    setSelectedDistrict('')
    setSelectedFacilityType('')
    setSelectedSiteId(null)
  }, [selectedProvince])

  // Update available facility types when district changes
  useEffect(() => {
    setAvailableFacilityTypes(getFacilityTypes(selectedProvince, selectedDistrict))
    setSelectedFacilityType('')
    setSelectedSiteId(null)
  }, [selectedProvince, selectedDistrict])

  // Update available sites when filters change
  useEffect(() => {
    setAvailableSites(getFilteredSites(selectedProvince, selectedDistrict, selectedFacilityType))
    setSelectedSiteId(null)
  }, [selectedProvince, selectedDistrict, selectedFacilityType])

  // Get selected site object
  const selectedSite = selectedSiteId ? getSiteById(selectedSiteId) : null

  // Get translated indicator names
  const getIndicatorName = (key: string) => {
    const map: Record<string, keyof Translations> = {
      '1.1': 'ind_1_1',
      '2.1': 'ind_2_1',
      '3.1': 'ind_3_1',
      '4.1': 'ind_4_1',
      '5.1': 'ind_5_1',
      '6.1': 'ind_6_1',
    }
    return t[map[key]] || key
  }

  const getIndicatorDesc = (key: string) => {
    const map: Record<string, keyof Translations> = {
      '1.1': 'ind_1_1_desc',
      '2.1': 'ind_2_1_desc',
      '3.1': 'ind_3_1_desc',
      '4.1': 'ind_4_1_desc',
      '5.1': 'ind_5_1_desc',
      '6.1': 'ind_6_1_desc',
    }
    return t[map[key]] || ''
  }

  const getStatusLabel = (status: PerformanceStatus) => {
    const map: Record<PerformanceStatus, keyof Translations> = {
      'optimal': 'optimal',
      'effective': 'effective',
      'improving': 'improving',
      'sub-improving': 'subImproving',
      'stressed': 'stressed',
    }
    return t[map[status]]
  }

  const getPathwayName = (key: string) => {
    const map: Record<string, keyof Translations> = {
      'prioritization': 'prioritization',
      'rationalization': 'rationalization',
      'transition-ready': 'transitionReady',
      'graduation': 'graduation',
      're-engagement': 'reengagement',
    }
    return t[map[key]] || key
  }

  const getPathwayDesc = (key: string) => {
    const map: Record<string, keyof Translations> = {
      'prioritization': 'prioritizationDesc',
      'rationalization': 'rationalizationDesc',
      'transition-ready': 'transitionReadyDesc',
      'graduation': 'graduationDesc',
      're-engagement': 'reengagementDesc',
    }
    return t[map[key]] || ''
  }

  // Translate facility type
  const getFacilityTypeLabel = (type: string) => {
    const map: Record<string, { en: string; id: string }> = {
      'Puskesmas': { en: 'Puskesmas', id: 'Puskesmas' },
      'Hospital': { en: 'Hospital', id: 'Rumah Sakit' },
      'NGO clinic': { en: 'NGO Clinic', id: 'Klinik LSM' },
    }
    return map[type]?.[language] || type
  }

  const handleIndicatorChange = (indicator: string, value: string) => {
    const numValue = value === '' ? null : parseFloat(value)
    const status = numValue !== null ? getIndicatorStatus(indicator, numValue) : null
    
    setIndicators(prev => ({
      ...prev,
      [indicator]: { ...prev[indicator], value, status }
    }))
  }

  const handleNAToggle = (indicator: string) => {
    setIndicators(prev => ({
      ...prev,
      [indicator]: { 
        value: '', 
        status: null, 
        isNA: !prev[indicator].isNA 
      }
    }))
  }

  // Count indicators excluding N/A
  const activeIndicators = Object.values(indicators).filter(i => !i.isNA)
  
  const countAtTarget = activeIndicators.filter(
    i => i.status === 'optimal' || i.status === 'effective'
  ).length

  const countImproving = activeIndicators.filter(
    i => i.status === 'improving' || i.status === 'sub-improving'
  ).length

  const countStressed = activeIndicators.filter(
    i => i.status === 'stressed'
  ).length

  const countNA = Object.values(indicators).filter(i => i.isNA).length

  const handleSave = () => {
    if (!selectedSiteId) {
      alert(language === 'en' ? 'Please select a site.' : 'Silakan pilih fasilitas.')
      return
    }
    if (!selectedPathway) {
      alert(language === 'en' ? 'Please select a Technical Support Pathway.' : 'Silakan pilih Jalur Dukungan Teknis.')
      return
    }
    
    const message = language === 'en' 
      ? `Quarterly data saved successfully!\n\nSite: ${selectedSite?.name}\nPathway: ${selectedPathway}\n\n(Demo mode - data not persisted to database yet)`
      : `Data kuartalan berhasil disimpan!\n\nFasilitas: ${selectedSite?.name}\nJalur: ${selectedPathway}\n\n(Mode demo - data belum tersimpan ke database)`
    alert(message)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-epic-navy">{t.quarterlyEntryTitle}</h2>
        <p className="text-gray-500 text-sm mt-1">
          {language === 'en' 
            ? 'Enter site performance data at the start of each quarter'
            : 'Masukkan data kinerja fasilitas di awal setiap kuartal'}
        </p>
      </div>

      {/* Site Selection Card - Cascading Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 pb-3 border-b-2 border-epic-light-blue">
          {language === 'en' ? 'Site Selection' : 'Pemilihan Fasilitas'}
        </h3>
        
        {/* Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Province */}
          <div>
            <label className="block text-sm text-gray-500 mb-1.5 font-medium">
              {language === 'en' ? 'Province' : 'Provinsi'}
            </label>
            <select 
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-epic-primary focus:ring-2 focus:ring-epic-primary/10"
            >
              <option value="">{language === 'en' ? '-- All Provinces --' : '-- Semua Provinsi --'}</option>
              {PROVINCES.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-sm text-gray-500 mb-1.5 font-medium">
              {language === 'en' ? 'District' : 'Kabupaten/Kota'}
            </label>
            <select 
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={!selectedProvince}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-epic-primary focus:ring-2 focus:ring-epic-primary/10 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">{language === 'en' ? '-- All Districts --' : '-- Semua Kabupaten --'}</option>
              {availableDistricts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          {/* Facility Type */}
          <div>
            <label className="block text-sm text-gray-500 mb-1.5 font-medium">
              {language === 'en' ? 'Facility Type' : 'Jenis Fasilitas'}
            </label>
            <select 
              value={selectedFacilityType}
              onChange={(e) => setSelectedFacilityType(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-epic-primary focus:ring-2 focus:ring-epic-primary/10"
            >
              <option value="">{language === 'en' ? '-- All Types --' : '-- Semua Jenis --'}</option>
              {availableFacilityTypes.map(type => (
                <option key={type} value={type}>{getFacilityTypeLabel(type)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Site Selection */}
        <div>
          <label className="block text-sm text-gray-500 mb-1.5 font-medium">
            {t.selectSite} 
            <span className="text-epic-primary ml-2">
              ({availableSites.length} {language === 'en' ? 'sites available' : 'fasilitas tersedia'})
            </span>
          </label>
          <select 
            value={selectedSiteId || ''}
            onChange={(e) => setSelectedSiteId(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-epic-primary focus:ring-2 focus:ring-epic-primary/10"
          >
            <option value="">-- {t.selectSite} --</option>
            {availableSites.map(site => (
              <option key={site.id} value={site.id}>
                {site.name} ({site.district})
              </option>
            ))}
          </select>
        </div>

        {/* Selected Site Info */}
        {selectedSite && (
          <div className="mt-4 p-4 bg-epic-light-blue rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-epic-primary rounded-lg flex items-center justify-center text-white text-lg">
                🏥
              </div>
              <div className="flex-1">
                <div className="font-bold text-epic-navy">{selectedSite.name}</div>
                <div className="text-sm text-gray-600">
                  {selectedSite.district}, {selectedSite.province} • {getFacilityTypeLabel(selectedSite.facilityType)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quarter & Patient Count */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 pb-3 border-b-2 border-epic-light-blue">
          {language === 'en' ? 'Reporting Period' : 'Periode Pelaporan'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1.5 font-medium">
              {language === 'en' ? 'Quarter' : 'Kuartal'}
            </label>
            <select 
              value={selectedFYQuarter}
              onChange={(e) => setSelectedFYQuarter(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-epic-primary focus:ring-2 focus:ring-epic-primary/10"
            >
              <option value="Q1">Q1 ({language === 'en' ? 'Oct - Dec' : 'Okt - Des'})</option>
              <option value="Q2">Q2 ({language === 'en' ? 'Jan - Mar' : 'Jan - Mar'})</option>
              <option value="Q3">Q3 ({language === 'en' ? 'Apr - Jun' : 'Apr - Jun'})</option>
              <option value="Q4">Q4 ({language === 'en' ? 'Jul - Sep' : 'Jul - Sep'})</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1.5 font-medium">
              {language === 'en' ? 'Fiscal Year' : 'Tahun Fiskal'}
            </label>
            <select 
              value={selectedFY}
              onChange={(e) => setSelectedFY(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-epic-primary focus:ring-2 focus:ring-epic-primary/10"
            >
              <option value="25">FY25</option>
              <option value="26">FY26</option>
              <option value="27">FY27</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1.5 font-medium">{t.patientsOnTreatment}</label>
            <input 
              type="number" 
              value={patientCount}
              onChange={(e) => setPatientCount(e.target.value)}
              placeholder={language === 'en' ? 'Enter patient count' : 'Masukkan jumlah pasien'}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-epic-primary focus:ring-2 focus:ring-epic-primary/10"
              min="0"
            />
          </div>
        </div>
        {/* Display selected period */}
        <div className="mt-3 text-sm text-epic-primary font-medium">
          {language === 'en' ? 'Selected: ' : 'Dipilih: '}
          {selectedFYQuarter} FY{selectedFY}
          {selectedFYQuarter === 'Q1' && ` (${language === 'en' ? 'October - December' : 'Oktober - Desember'} 20${parseInt(selectedFY) - 1})`}
          {selectedFYQuarter === 'Q2' && ` (${language === 'en' ? 'January - March' : 'Januari - Maret'} 20${selectedFY})`}
          {selectedFYQuarter === 'Q3' && ` (${language === 'en' ? 'April - June' : 'April - Juni'} 20${selectedFY})`}
          {selectedFYQuarter === 'Q4' && ` (${language === 'en' ? 'July - September' : 'Juli - September'} 20${selectedFY})`}
        </div>
      </div>

      {/* Performance Indicators Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 pb-3 border-b-2 border-epic-light-blue">
          {t.performanceIndicators}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {language === 'en'
            ? 'Enter the percentage achieved for each indicator. Status colors update automatically based on Sustainable Excellence thresholds.'
            : 'Masukkan persentase yang dicapai untuk setiap indikator. Warna status diperbarui secara otomatis berdasarkan ambang batas Keunggulan Berkelanjutan.'}
        </p>

        <div className="space-y-3">
          {Object.keys(indicators).map((key) => (
            <div key={key} className={`flex items-center p-4 border rounded-lg transition-colors ${
              indicators[key].isNA 
                ? 'border-gray-200 bg-gray-50' 
                : 'border-gray-200 hover:border-epic-primary'
            }`}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold mr-4 flex-shrink-0 ${
                indicators[key].isNA 
                  ? 'bg-gray-200 text-gray-400' 
                  : 'bg-epic-light-blue text-epic-navy'
              }`}>
                {key}
              </div>
              <div className="flex-1 min-w-0 mr-4">
                <div className={`font-semibold text-sm ${indicators[key].isNA ? 'text-gray-400' : 'text-epic-navy'}`}>
                  {getIndicatorName(key)}
                </div>
                <div className="text-xs text-gray-500 truncate">{getIndicatorDesc(key)}</div>
              </div>
              <div className="flex items-center gap-2">
                {/* N/A Checkbox */}
                <label className="flex items-center gap-1.5 mr-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={indicators[key].isNA}
                    onChange={() => handleNAToggle(key)}
                    className="w-4 h-4 rounded border-gray-300 text-gray-500 focus:ring-gray-400"
                  />
                  <span className="text-xs text-gray-500 font-medium">N/A</span>
                </label>
                
                <input
                  type="number"
                  value={indicators[key].isNA ? '' : indicators[key].value}
                  onChange={(e) => handleIndicatorChange(key, e.target.value)}
                  placeholder={indicators[key].isNA ? '--' : '--'}
                  disabled={indicators[key].isNA}
                  min="0"
                  max="100"
                  className={`w-20 px-3 py-2.5 border-2 rounded-lg text-center font-semibold text-lg transition-all focus:outline-none ${
                    indicators[key].isNA
                      ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      : indicators[key].status 
                        ? statusColors[indicators[key].status!] 
                        : 'border-gray-300'
                  }`}
                />
                <span className={`font-semibold ${indicators[key].isNA ? 'text-gray-400' : 'text-epic-navy'}`}>%</span>
                <span className={`px-2.5 py-1 rounded text-xs font-semibold text-white min-w-[70px] text-center ${
                  indicators[key].isNA
                    ? 'bg-gray-400'
                    : indicators[key].status 
                      ? statusBadgeColors[indicators[key].status!] 
                      : 'bg-gray-300'
                }`}>
                  {indicators[key].isNA 
                    ? 'N/A' 
                    : indicators[key].status 
                      ? getStatusLabel(indicators[key].status!) 
                      : '--'}
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
          <span>📊</span> {showThresholds ? t.hideThresholds : t.showThresholds}
        </button>

        {showThresholds && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="bg-epic-navy text-white p-2 text-left rounded-tl">{t.indicator}</th>
                  <th className="bg-green-100 p-2 text-center">{t.optimal}</th>
                  <th className="bg-lime-100 p-2 text-center">{t.effective}</th>
                  <th className="bg-orange-100 p-2 text-center">{t.improving}</th>
                  <th className="bg-orange-200 p-2 text-center">({t.subImproving})</th>
                  <th className="bg-red-100 p-2 text-center rounded-tr">{t.stressed}</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(THRESHOLDS).map(([key, threshold]) => (
                  <tr key={key} className="border-b border-gray-200">
                    <td className="p-2 font-medium">{key}</td>
                    <td className="p-2 text-center bg-green-50">&gt;{threshold.optimal}%</td>
                    <td className="p-2 text-center bg-lime-50">{threshold.effective}-{threshold.optimal - 1}%</td>
                    <td className="p-2 text-center bg-orange-50">{threshold.improving}-{threshold.effective - 1}%</td>
                    <td className="p-2 text-center bg-orange-100">{threshold.sub}-{threshold.improving - 1}%</td>
                    <td className="p-2 text-center bg-red-50">&lt;{threshold.sub}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-gray-500 italic">
              {language === 'en' 
                ? 'Source: Sustainable Excellence Framework, February 2026'
                : 'Sumber: Kerangka Keunggulan Berkelanjutan, Februari 2026'}
            </p>
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 p-5 bg-gradient-to-br from-epic-light-blue to-blue-50 rounded-lg">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-epic-navy">{countAtTarget}</div>
              <div className="text-xs text-gray-500 mt-1">{t.optimal} / {t.effective}</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-epic-navy">{countImproving}</div>
              <div className="text-xs text-gray-500 mt-1">{t.improving}</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-epic-navy">{countStressed}</div>
              <div className="text-xs text-gray-500 mt-1">{t.stressed}</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-gray-400">{countNA}</div>
              <div className="text-xs text-gray-500 mt-1">N/A</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pathway Assignment Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 pb-3 border-b-2 border-epic-light-blue">
          {t.pathwayAssignment}
        </h3>
        
        {/* Indicator count helper */}
        <div className="mb-4 p-4 bg-gradient-to-r from-epic-light-blue to-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-epic-navy">
                {language === 'en' ? 'Indicators at Optimal/Effective:' : 'Indikator pada Optimal/Efektif:'}
              </span>
              <span className="ml-2 text-2xl font-bold text-epic-primary">{countAtTarget}</span>
              <span className="text-sm text-gray-500 ml-1">/ 6</span>
            </div>
            <div className="text-right">
              <div className={`text-sm font-semibold ${countAtTarget >= 4 ? 'text-green-600' : 'text-orange-600'}`}>
                {countAtTarget >= 4 
                  ? (language === 'en' ? '→ Eligible for Rationalization or higher' : '→ Memenuhi syarat Rasionalisasi atau lebih tinggi')
                  : (language === 'en' ? '→ Prioritization recommended' : '→ Prioritisasi direkomendasikan')}
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          {language === 'en'
            ? 'Select the appropriate pathway based on current performance and historical trends.'
            : 'Pilih jalur yang sesuai berdasarkan kinerja saat ini dan tren historis.'}
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
                {getPathwayName(key)}
              </span>
              <div className="flex-1">
                <div className="font-semibold text-sm text-epic-navy">{getPathwayDesc(key)}</div>
                <div className="text-xs text-gray-500">
                  {language === 'en' ? 'Contact frequency' : 'Frekuensi kontak'}: {pathway.contactFrequency}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Mentor Assignment Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 pb-3 border-b-2 border-epic-light-blue">
          {t.assignedMentor}
        </h3>
        
        <p className="text-sm text-gray-500 mb-4">
          {language === 'en' 
            ? 'Select one or more mentors assigned to support this site.'
            : 'Pilih satu atau lebih pendamping yang ditugaskan untuk mendukung fasilitas ini.'}
        </p>

        {/* Selected mentors display */}
        {selectedMentors.length > 0 && (
          <div className="mb-4 p-3 bg-epic-light-blue rounded-lg">
            <div className="text-xs text-gray-500 mb-2 font-medium">
              {language === 'en' ? 'Selected:' : 'Dipilih:'} {selectedMentors.length} {language === 'en' ? 'mentor(s)' : 'pendamping'}
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedMentors.map(id => {
                const mentor = mentors.find(m => m.id === id)
                return mentor ? (
                  <span 
                    key={id}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-sm font-medium text-epic-navy border border-epic-primary"
                  >
                    {mentor.name}
                    <button 
                      onClick={() => handleMentorToggle(id)}
                      className="ml-1 text-gray-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ) : null
              })}
            </div>
          </div>
        )}

        {/* Mentor checkboxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
          {mentors.map(mentor => (
            <label 
              key={mentor.id}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                selectedMentors.includes(mentor.id)
                  ? 'border-epic-primary bg-epic-light-blue'
                  : 'border-gray-200 hover:border-epic-primary'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedMentors.includes(mentor.id)}
                onChange={() => handleMentorToggle(mentor.id)}
                className="w-4 h-4 rounded border-gray-300 text-epic-primary focus:ring-epic-primary mr-3"
              />
              <span className="text-sm font-medium text-epic-navy">{mentor.name}</span>
            </label>
          ))}
        </div>

        {/* Add New Mentor Button */}
        {!showAddMentor ? (
          <button
            onClick={() => setShowAddMentor(true)}
            className="text-sm text-epic-primary hover:underline font-medium"
          >
            ➕ {language === 'en' ? 'Add new mentor' : 'Tambah pendamping baru'}
          </button>
        ) : (
          <div className="p-3 border border-epic-primary rounded-lg bg-epic-light-blue">
            <label className="block text-sm text-epic-navy mb-1.5 font-medium">
              {language === 'en' ? 'New Mentor Name' : 'Nama Pendamping Baru'}
            </label>
            <div className="flex gap-2">
              <input 
                type="text"
                value={newMentorName}
                onChange={(e) => setNewMentorName(e.target.value)}
                placeholder={language === 'en' ? 'Enter full name' : 'Masukkan nama lengkap'}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-epic-primary"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddMentor()
                  }
                }}
              />
              <button
                onClick={handleAddMentor}
                disabled={!newMentorName.trim()}
                className="px-4 py-2 bg-epic-primary text-white rounded-lg text-sm font-medium hover:bg-epic-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {language === 'en' ? 'Add' : 'Tambah'}
              </button>
              <button
                onClick={() => {
                  setShowAddMentor(false)
                  setNewMentorName('')
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                {language === 'en' ? 'Cancel' : 'Batal'}
              </button>
            </div>
          </div>
        )}

        {/* Contact Frequency */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <label className="block text-sm text-gray-500 mb-1.5 font-medium">
            {language === 'en' ? 'Expected Contact Frequency' : 'Frekuensi Kontak yang Diharapkan'}
          </label>
          <input 
            type="text" 
            readOnly
            value={selectedPathway ? PATHWAYS[selectedPathway as keyof typeof PATHWAYS].contactFrequency : (language === 'en' ? 'Based on pathway selection' : 'Berdasarkan pilihan jalur')}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button className="px-6 py-3 border-2 border-gray-300 rounded-lg text-sm font-semibold text-epic-navy hover:border-epic-navy transition-colors">
          {language === 'en' ? 'Cancel' : 'Batal'}
        </button>
        <button 
          onClick={handleSave}
          className="flex-1 px-6 py-3 bg-epic-primary text-white rounded-lg text-sm font-semibold hover:bg-epic-primary/90 transition-colors"
        >
          {t.saveEntry}
        </button>
      </div>
    </div>
  )
}
