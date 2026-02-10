// EpiC Indonesia Supported Sites - 146 facilities
// Data source: 146_epic_supported_sites.xlsx

export interface Site {
  id: number
  name: string
  province: string
  district: string
  facilityType: string
}

export const SITES: Site[] = [
  { id: 1, name: "KLINIK GLOBALINDO", province: "Jakarta", district: "South Jakarta", facilityType: "NGO clinic" },
  { id: 2, name: "KLINIK YAYASAN ANGSA MERAH", province: "Jakarta", district: "South Jakarta", facilityType: "NGO clinic" },
  { id: 3, name: "PUSKESMAS KEC. CILANDAK", province: "Jakarta", district: "South Jakarta", facilityType: "Puskesmas" },
  { id: 4, name: "PUSKESMAS KEC. JAGAKARSA", province: "Jakarta", district: "South Jakarta", facilityType: "Puskesmas" },
  { id: 5, name: "PUSKESMAS KEC. KEBAYORAN BARU", province: "Jakarta", district: "South Jakarta", facilityType: "Puskesmas" },
  { id: 6, name: "PUSKESMAS KEC. KEBAYORAN LAMA", province: "Jakarta", district: "South Jakarta", facilityType: "Puskesmas" },
  { id: 7, name: "PUSKESMAS KEC. MAMPANG", province: "Jakarta", district: "South Jakarta", facilityType: "Puskesmas" },
  { id: 8, name: "PUSKESMAS KEC. PANCORAN", province: "Jakarta", district: "South Jakarta", facilityType: "Puskesmas" },
  { id: 9, name: "PUSKESMAS KEC. PASAR MINGGU", province: "Jakarta", district: "South Jakarta", facilityType: "Puskesmas" },
  { id: 10, name: "PUSKESMAS KEC. PESANGGRAHAN", province: "Jakarta", district: "South Jakarta", facilityType: "Puskesmas" },
  { id: 11, name: "PUSKESMAS KEC. SETIABUDI", province: "Jakarta", district: "South Jakarta", facilityType: "Puskesmas" },
  { id: 12, name: "PUSKESMAS KEC. TEBET", province: "Jakarta", district: "South Jakarta", facilityType: "Puskesmas" },
  { id: 13, name: "RS BRAWIJAYA W&CHILD HOSPITAL", province: "Jakarta", district: "South Jakarta", facilityType: "Hospital" },
  { id: 14, name: "RS FATMAWATI", province: "Jakarta", district: "South Jakarta", facilityType: "Hospital" },
  { id: 15, name: "RS MEDISTRA", province: "Jakarta", district: "South Jakarta", facilityType: "Hospital" },
  { id: 16, name: "RS MMC", province: "Jakarta", district: "South Jakarta", facilityType: "Hospital" },
  { id: 17, name: "RS MUHAMMADIYAH TAMAN PURING", province: "Jakarta", district: "South Jakarta", facilityType: "Hospital" },
  { id: 18, name: "RS PUSAT PERTAMINA", province: "Jakarta", district: "South Jakarta", facilityType: "Hospital" },
  { id: 19, name: "RSUD JAGAKARSA", province: "Jakarta", district: "South Jakarta", facilityType: "Hospital" },
  { id: 20, name: "RSUD JATI PADANG", province: "Jakarta", district: "South Jakarta", facilityType: "Hospital" },
  { id: 21, name: "RSUD KEBAYORAN BARU", province: "Jakarta", district: "South Jakarta", facilityType: "Hospital" },
  { id: 22, name: "RSUD MAMPANG PRAPATAN", province: "Jakarta", district: "South Jakarta", facilityType: "Hospital" },
  { id: 23, name: "RSUD PASAR MINGGU", province: "Jakarta", district: "South Jakarta", facilityType: "Hospital" },
  { id: 24, name: "RSUD PESANGGRAHAN", province: "Jakarta", district: "South Jakarta", facilityType: "Hospital" },
  { id: 25, name: "RSUK TEBET", province: "Jakarta", district: "South Jakarta", facilityType: "Hospital" },
  { id: 26, name: "PUSKESMAS KEC. CENGKARENG", province: "Jakarta", district: "West Jakarta", facilityType: "Puskesmas" },
  { id: 27, name: "PUSKESMAS KEC. GROGOL PETAMBURAN", province: "Jakarta", district: "West Jakarta", facilityType: "Puskesmas" },
  { id: 28, name: "PUSKESMAS KEC. KALIDERES", province: "Jakarta", district: "West Jakarta", facilityType: "Puskesmas" },
  { id: 29, name: "PUSKESMAS KEC. KEBON JERUK", province: "Jakarta", district: "West Jakarta", facilityType: "Puskesmas" },
  { id: 30, name: "PUSKESMAS KEC. KEMBANGAN", province: "Jakarta", district: "West Jakarta", facilityType: "Puskesmas" },
  { id: 31, name: "PUSKESMAS KEC. PALMERAH", province: "Jakarta", district: "West Jakarta", facilityType: "Puskesmas" },
  { id: 32, name: "PUSKESMAS KEC. TAMAN SARI", province: "Jakarta", district: "West Jakarta", facilityType: "Puskesmas" },
  { id: 33, name: "PUSKESMAS KEC. TAMBORA", province: "Jakarta", district: "West Jakarta", facilityType: "Puskesmas" },
  { id: 34, name: "RS GRHA KEDOYA", province: "Jakarta", district: "West Jakarta", facilityType: "Hospital" },
  { id: 35, name: "RS HERMINA DAAN MOGOT", province: "Jakarta", district: "West Jakarta", facilityType: "Hospital" },
  { id: 36, name: "RS KANKER DHARMAIS", province: "Jakarta", district: "West Jakarta", facilityType: "Hospital" },
  { id: 37, name: "RS ROYAL TARUMA", province: "Jakarta", district: "West Jakarta", facilityType: "Hospital" },
  { id: 38, name: "RS SILOAM HOSPITALS KEBON JERUK", province: "Jakarta", district: "West Jakarta", facilityType: "Hospital" },
  { id: 39, name: "RSAB HARAPAN KITA", province: "Jakarta", district: "West Jakarta", facilityType: "Hospital" },
  { id: 40, name: "RSU PELNI PETAMBURAN", province: "Jakarta", district: "West Jakarta", facilityType: "Hospital" },
  { id: 41, name: "RSUD CENGKARENG", province: "Jakarta", district: "West Jakarta", facilityType: "Hospital" },
  { id: 42, name: "RSUD KALIDERES", province: "Jakarta", district: "West Jakarta", facilityType: "Hospital" },
  { id: 43, name: "RSUD KEMBANGAN", province: "Jakarta", district: "West Jakarta", facilityType: "Hospital" },
  { id: 44, name: "RSUD TAMAN SARI", province: "Jakarta", district: "West Jakarta", facilityType: "Hospital" },
  { id: 45, name: "PUSKESMAS KEC. CAKUNG", province: "Jakarta", district: "East Jakarta", facilityType: "Puskesmas" },
  { id: 46, name: "PUSKESMAS KEC. CIPAYUNG", province: "Jakarta", district: "East Jakarta", facilityType: "Puskesmas" },
  { id: 47, name: "PUSKESMAS KEC. CIRACAS", province: "Jakarta", district: "East Jakarta", facilityType: "Puskesmas" },
  { id: 48, name: "PUSKESMAS KEC. DUREN SAWIT", province: "Jakarta", district: "East Jakarta", facilityType: "Puskesmas" },
  { id: 49, name: "PUSKESMAS KEC. JATINEGARA", province: "Jakarta", district: "East Jakarta", facilityType: "Puskesmas" },
  { id: 50, name: "PUSKESMAS KEC. KRAMAT JATI", province: "Jakarta", district: "East Jakarta", facilityType: "Puskesmas" },
  { id: 51, name: "PUSKESMAS KEC. MAKASAR", province: "Jakarta", district: "East Jakarta", facilityType: "Puskesmas" },
  { id: 52, name: "PUSKESMAS KEC. MATRAMAN", province: "Jakarta", district: "East Jakarta", facilityType: "Puskesmas" },
  { id: 53, name: "PUSKESMAS KEC. PASAR REBO", province: "Jakarta", district: "East Jakarta", facilityType: "Puskesmas" },
  { id: 54, name: "PUSKESMAS KEC. PULO GADUNG", province: "Jakarta", district: "East Jakarta", facilityType: "Puskesmas" },
  { id: 55, name: "RS FK UKI", province: "Jakarta", district: "East Jakarta", facilityType: "Hospital" },
  { id: 56, name: "RS HARAPAN BUNDA", province: "Jakarta", district: "East Jakarta", facilityType: "Hospital" },
  { id: 57, name: "RS HERMINA JATINEGARA", province: "Jakarta", district: "East Jakarta", facilityType: "Hospital" },
  { id: 58, name: "RSKD DUREN SAWIT", province: "Jakarta", district: "East Jakarta", facilityType: "Hospital" },
  { id: 59, name: "RS MOH RIDWAN MEURAKSA", province: "Jakarta", district: "East Jakarta", facilityType: "Hospital" },
  { id: 60, name: "RS PENGAYOMAN", province: "Jakarta", district: "East Jakarta", facilityType: "Hospital" },
  { id: 61, name: "RS POLRI", province: "Jakarta", district: "East Jakarta", facilityType: "Hospital" },
  { id: 62, name: "RS PREMIER JATINEGARA", province: "Jakarta", district: "East Jakarta", facilityType: "Hospital" },
  { id: 63, name: "RS PUSAT OTAK NASIONAL", province: "Jakarta", district: "East Jakarta", facilityType: "Hospital" },
  { id: 64, name: "RS TK IV CIJANTUNG KESDAM JAYA", province: "Jakarta", district: "East Jakarta", facilityType: "Hospital" },
  { id: 65, name: "RSAU DR. ESNAWAN ANTARIKSA", province: "Jakarta", district: "East Jakarta", facilityType: "Hospital" },
  { id: 66, name: "RSKO", province: "Jakarta", district: "East Jakarta", facilityType: "Hospital" },
  { id: 67, name: "RSUD CIRACAS", province: "Jakarta", district: "East Jakarta", facilityType: "Hospital" },
  { id: 68, name: "RSUD BUDHI ASIH", province: "Jakarta", district: "East Jakarta", facilityType: "Hospital" },
  { id: 69, name: "RSUD MATRAMAN", province: "Jakarta", district: "East Jakarta", facilityType: "Hospital" },
  { id: 70, name: "RSUD PASAR REBO", province: "Jakarta", district: "East Jakarta", facilityType: "Hospital" },
  { id: 71, name: "RSUP PERSAHABATAN", province: "Jakarta", district: "East Jakarta", facilityType: "Hospital" },
  { id: 72, name: "ANGSAMERAH", province: "Jakarta", district: "Central Jakarta", facilityType: "NGO clinic" },
  { id: 73, name: "RUANG CARLO", province: "Jakarta", district: "Central Jakarta", facilityType: "NGO clinic" },
  { id: 74, name: "PUSKESMAS KEC. CEMPAKA PUTIH", province: "Jakarta", district: "Central Jakarta", facilityType: "Puskesmas" },
  { id: 75, name: "PUSKESMAS KEC. GAMBIR", province: "Jakarta", district: "Central Jakarta", facilityType: "Puskesmas" },
  { id: 76, name: "PUSKESMAS KEC. JOHAR BARU", province: "Jakarta", district: "Central Jakarta", facilityType: "Puskesmas" },
  { id: 77, name: "PUSKESMAS KEC. KEMAYORAN", province: "Jakarta", district: "Central Jakarta", facilityType: "Puskesmas" },
  { id: 78, name: "PUSKESMAS KEC. MENTENG", province: "Jakarta", district: "Central Jakarta", facilityType: "Puskesmas" },
  { id: 79, name: "PUSKESMAS KEC. SAWAH BESAR", province: "Jakarta", district: "Central Jakarta", facilityType: "Puskesmas" },
  { id: 80, name: "PUSKESMAS KEC. SENEN", province: "Jakarta", district: "Central Jakarta", facilityType: "Puskesmas" },
  { id: 81, name: "PUSKESMAS KEC. TANAH ABANG", province: "Jakarta", district: "Central Jakarta", facilityType: "Puskesmas" },
  { id: 82, name: "RS HERMINA KEMAYORAN", province: "Jakarta", district: "Central Jakarta", facilityType: "Hospital" },
  { id: 83, name: "RS HUSADA", province: "Jakarta", district: "Central Jakarta", facilityType: "Hospital" },
  { id: 84, name: "RS ISLAM JAKARTA CEMPAKA PUTIH", province: "Jakarta", district: "Central Jakarta", facilityType: "Hospital" },
  { id: 85, name: "RS KRAMAT 128", province: "Jakarta", district: "Central Jakarta", facilityType: "Hospital" },
  { id: 86, name: "RS PGI CIKINI", province: "Jakarta", district: "Central Jakarta", facilityType: "Hospital" },
  { id: 87, name: "RSIA BUDI KEMULIAAN JAKARTA", province: "Jakarta", district: "Central Jakarta", facilityType: "Hospital" },
  { id: 88, name: "RSU PAD GATOT SOEBROTO", province: "Jakarta", district: "Central Jakarta", facilityType: "Hospital" },
  { id: 89, name: "RSUD CEMPAKA PUTIH", province: "Jakarta", district: "Central Jakarta", facilityType: "Hospital" },
  { id: 90, name: "RSUD JOHAR BARU", province: "Jakarta", district: "Central Jakarta", facilityType: "Hospital" },
  { id: 91, name: "RSUD SAWAH BESAR", province: "Jakarta", district: "Central Jakarta", facilityType: "Hospital" },
  { id: 92, name: "RSUD TARAKAN", province: "Jakarta", district: "Central Jakarta", facilityType: "Hospital" },
  { id: 93, name: "RSUP NASIONAL DR. CIPTO MANGUNKUSUMO", province: "Jakarta", district: "Central Jakarta", facilityType: "Hospital" },
  { id: 94, name: "PUSKESMAS KEC. CILINCING", province: "Jakarta", district: "North Jakarta", facilityType: "Puskesmas" },
  { id: 95, name: "PUSKESMAS KEC. KELAPA GADING", province: "Jakarta", district: "North Jakarta", facilityType: "Puskesmas" },
  { id: 96, name: "PUSKESMAS KEC. KOJA", province: "Jakarta", district: "North Jakarta", facilityType: "Puskesmas" },
  { id: 97, name: "PUSKESMAS KEC. PADEMANGAN", province: "Jakarta", district: "North Jakarta", facilityType: "Puskesmas" },
  { id: 98, name: "PUSKESMAS KEC. PENJARINGAN", province: "Jakarta", district: "North Jakarta", facilityType: "Puskesmas" },
  { id: 99, name: "PUSKESMAS KEC. TANJUNG PRIOK", province: "Jakarta", district: "North Jakarta", facilityType: "Puskesmas" },
  { id: 100, name: "RS AKADEMIK ATMA JAYA", province: "Jakarta", district: "North Jakarta", facilityType: "Hospital" },
  { id: 101, name: "RS FIRDAUS", province: "Jakarta", district: "North Jakarta", facilityType: "Hospital" },
  { id: 102, name: "RS ISLAM JAKARTA UTARA", province: "Jakarta", district: "North Jakarta", facilityType: "Hospital" },
  { id: 103, name: "RS PLUIT", province: "Jakarta", district: "North Jakarta", facilityType: "Hospital" },
  { id: 104, name: "RSPI SS", province: "Jakarta", district: "North Jakarta", facilityType: "Hospital" },
  { id: 105, name: "RSUD CILINCING", province: "Jakarta", district: "North Jakarta", facilityType: "Hospital" },
  { id: 106, name: "RSUD KOJA", province: "Jakarta", district: "North Jakarta", facilityType: "Hospital" },
  { id: 107, name: "RSUD PADEMANGAN", province: "Jakarta", district: "North Jakarta", facilityType: "Hospital" },
  { id: 108, name: "RSUD TANJUNG PRIOK", province: "Jakarta", district: "North Jakarta", facilityType: "Hospital" },
  { id: 109, name: "RSUD TUGU KOJA", province: "Jakarta", district: "North Jakarta", facilityType: "Hospital" },
  { id: 110, name: "RS PARU DR. GOENAWAN PARTOWIDIGDO CISARUA", province: "West Java", district: "Bogor", facilityType: "Hospital" },
  { id: 111, name: "RSU CIAWI", province: "West Java", district: "Bogor", facilityType: "Hospital" },
  { id: 112, name: "RSU CIBINONG", province: "West Java", district: "Bogor", facilityType: "Hospital" },
  { id: 113, name: "RSUD CILEUNGSI", province: "West Java", district: "Bogor", facilityType: "Hospital" },
  { id: 114, name: "RSUD LEUWILIANG BOGOR", province: "West Java", district: "Bogor", facilityType: "Hospital" },
  { id: 115, name: "PUSKESMAS CILEUNGSI", province: "West Java", district: "Bogor", facilityType: "Puskesmas" },
  { id: 116, name: "PUSKESMAS MEKARMUKTI", province: "West Java", district: "Bekasi", facilityType: "Puskesmas" },
  { id: 117, name: "RSUD KAB. BEKASI", province: "West Java", district: "Bekasi", facilityType: "Hospital" },
  { id: 118, name: "PUSKESMAS BOGOR TENGAH", province: "West Java", district: "Kota Bogor", facilityType: "Puskesmas" },
  { id: 119, name: "PUSKESMAS BOGOR TIMUR", province: "West Java", district: "Kota Bogor", facilityType: "Puskesmas" },
  { id: 120, name: "PUSKESMAS KEDUNG BADAK BOGOR", province: "West Java", district: "Kota Bogor", facilityType: "Puskesmas" },
  { id: 121, name: "PUSKESMAS SINDANG BARANG BOGOR", province: "West Java", district: "Kota Bogor", facilityType: "Puskesmas" },
  { id: 122, name: "RSJ DR. H. MARZOEKI MAHDI", province: "West Java", district: "Kota Bogor", facilityType: "Hospital" },
  { id: 123, name: "RSUD KOTA BOGOR", province: "West Java", district: "Kota Bogor", facilityType: "Hospital" },
  { id: 124, name: "PUSKESMAS KARANG KITRI", province: "West Java", district: "Kota Bekasi", facilityType: "Puskesmas" },
  { id: 125, name: "PUSKESMAS MUSTIKA JAYA", province: "West Java", district: "Kota Bekasi", facilityType: "Puskesmas" },
  { id: 126, name: "PUSKESMAS PERUMNAS II", province: "West Java", district: "Kota Bekasi", facilityType: "Puskesmas" },
  { id: 127, name: "RS ST ELISABETH", province: "West Java", district: "Kota Bekasi", facilityType: "Hospital" },
  { id: 128, name: "RSUD KOTA BEKASI", province: "West Java", district: "Kota Bekasi", facilityType: "Hospital" },
  { id: 129, name: "PUSKESMAS CIMANGGIS", province: "West Java", district: "Kota Depok", facilityType: "Puskesmas" },
  { id: 130, name: "PUSKESMAS PANCORAN MAS", province: "West Java", district: "Kota Depok", facilityType: "Puskesmas" },
  { id: 131, name: "RS SENTRA MEDIKA CISALAK", province: "West Java", district: "Kota Depok", facilityType: "Hospital" },
  { id: 132, name: "RSUD KOTA DEPOK", province: "West Java", district: "Kota Depok", facilityType: "Hospital" },
  { id: 133, name: "PUSKESMAS CURUG TANGERANG", province: "Banten", district: "Tangerang", facilityType: "Puskesmas" },
  { id: 134, name: "PUSKESMAS KELAPA DUA TANGERANG", province: "Banten", district: "Tangerang", facilityType: "Puskesmas" },
  { id: 135, name: "PUSKESMAS MAUK TANGERANG", province: "Banten", district: "Tangerang", facilityType: "Puskesmas" },
  { id: 136, name: "PUSKESMAS BALARAJA", province: "Banten", district: "Tangerang", facilityType: "Puskesmas" },
  { id: 137, name: "RS QADR", province: "Banten", district: "Tangerang", facilityType: "Hospital" },
  { id: 138, name: "RS SILOAM GLENEAGLES", province: "Banten", district: "Tangerang", facilityType: "Hospital" },
  { id: 139, name: "RSU TANGERANG", province: "Banten", district: "Tangerang", facilityType: "Hospital" },
  { id: 140, name: "RSUD BALARAJA", province: "Banten", district: "Tangerang", facilityType: "Hospital" },
  { id: 141, name: "PUSKESMAS CIBODASARI TANGERANG", province: "Banten", district: "Kota Tangerang", facilityType: "Puskesmas" },
  { id: 142, name: "PUSKESMAS KUNCIRAN BARU", province: "Banten", district: "Kota Tangerang", facilityType: "Puskesmas" },
  { id: 143, name: "PUSKESMAS TANAH TINGGI", province: "Banten", district: "Kota Tangerang", facilityType: "Puskesmas" },
  { id: 144, name: "RSUD KOTA TANGERANG", province: "Banten", district: "Kota Tangerang", facilityType: "Hospital" },
  { id: 145, name: "PUSKESMAS CIPUTAT", province: "Banten", district: "Kota Tangerang Selatan", facilityType: "Puskesmas" },
  { id: 146, name: "RSUD TANGERANG SELATAN", province: "Banten", district: "Kota Tangerang Selatan", facilityType: "Hospital" },
]

// Get unique provinces
export const PROVINCES = Array.from(new Set(SITES.map(s => s.province))].sort()

// Get districts by province
export const getDistrictsByProvince = (province: string): string[] => {
  if (!province) return []
  return Array.from(new Set(SITES.filter(s => s.province === province).map(s => s.district))].sort()
}

// Get facility types available for filters
export const getFacilityTypes = (province?: string, district?: string): string[] => {
  let filtered = SITES
  if (province) filtered = filtered.filter(s => s.province === province)
  if (district) filtered = filtered.filter(s => s.district === district)
  return Array.from(new Set(filtered.map(s => s.facilityType))].sort()
}

// Get filtered sites
export const getFilteredSites = (province?: string, district?: string, facilityType?: string): Site[] => {
  let filtered = SITES
  if (province) filtered = filtered.filter(s => s.province === province)
  if (district) filtered = filtered.filter(s => s.district === district)
  if (facilityType) filtered = filtered.filter(s => s.facilityType === facilityType)
  return filtered.sort((a, b) => a.name.localeCompare(b.name))
}

// Get site by ID
export const getSiteById = (id: number): Site | undefined => {
  return SITES.find(s => s.id === id)
}
