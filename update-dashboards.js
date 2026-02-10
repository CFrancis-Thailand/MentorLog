const fs = require('fs');

// 1. Update page.tsx
let page = fs.readFileSync('app/page.tsx', 'utf8');
if (!page.includes('selectedSiteId')) {
  page = page.replace(
    /const \[activeTab, setActiveTab\] = useState(.*?)\n/,
    `const [activeTab, setActiveTab] = useState$1\n  const [selectedSiteId, setSelectedSiteId] = useState(null)\n`
  );
  page = page.replace(
    '<QuarterlyEntry language={language} translations={t} />',
    '<QuarterlyEntry language={language} translations={t} onSiteSelect={(id) => setSelectedSiteId(id)} />'
  );
  page = page.replace(
    '<SiteDashboard language={language} translations={t} />',
    '<SiteDashboard language={language} translations={t} selectedSiteId={selectedSiteId} />'
  );
  page = page.replace(
    '<DistrictDashboard language={language} translations={t} />',
    '<DistrictDashboard language={language} translations={t} selectedSiteId={selectedSiteId} />'
  );
  fs.writeFileSync('app/page.tsx', page);
  console.log('1. page.tsx updated');
}

// 2. Update QuarterlyEntry.tsx
let qe = fs.readFileSync('components/QuarterlyEntry.tsx', 'utf8');
if (!qe.includes('onSiteSelect')) {
  qe = qe.replace(
    'interface QuarterlyEntryProps {\n  language: Language\n  translations: Translations\n}',
    'interface QuarterlyEntryProps {\n  language: Language\n  translations: Translations\n  onSiteSelect?: (id: number | null) => void\n}'
  );
  qe = qe.replace(
    'QuarterlyEntry({ language, translations: t }: QuarterlyEntryProps)',
    'QuarterlyEntry({ language, translations: t, onSiteSelect }: QuarterlyEntryProps)'
  );
  // Add useEffect after the first existing useEffect
  const firstEffect = qe.indexOf('useEffect(() => {');
  if (firstEffect > -1) {
    qe = qe.slice(0, firstEffect) +
      'useEffect(() => { if (onSiteSelect) onSiteSelect(selectedSiteId) }, [selectedSiteId])\n\n  ' +
      qe.slice(firstEffect);
  }
  fs.writeFileSync('components/QuarterlyEntry.tsx', qe);
  console.log('2. QuarterlyEntry.tsx updated');
}

// 3. Update SiteDashboard.tsx
let sd = fs.readFileSync('components/SiteDashboard.tsx', 'utf8');
if (!sd.includes('selectedSiteId')) {
  sd = sd.replace(
    "import type { Language, Translations } from '@/app/page'",
    "import { getSiteById } from '@/lib/sites'\nimport type { Language, Translations } from '@/app/page'"
  );
  sd = sd.replace(
    'interface SiteDashboardProps {\n  language: Language\n  translations: Translations\n}',
    'interface SiteDashboardProps {\n  language: Language\n  translations: Translations\n  selectedSiteId?: number | null\n}'
  );
  sd = sd.replace(
    'SiteDashboard({ language, translations: t }: SiteDashboardProps)',
    'SiteDashboard({ language, translations: t, selectedSiteId }: SiteDashboardProps)'
  );
  // Add dynamic site lookup after function opens
  const sdFunc = sd.indexOf('export default function SiteDashboard');
  const sdBody = sd.indexOf('{', sdFunc + 50);
  const sdNext = sd.indexOf('\n', sdBody);
  sd = sd.slice(0, sdNext + 1) +
    '\n  const selectedSite = selectedSiteId ? getSiteById(selectedSiteId) : null\n' +
    '  const activeSiteData = selectedSite ? { ...sampleSiteData, name: selectedSite.name, district: selectedSite.district, province: selectedSite.province, siteType: selectedSite.facilityType } : sampleSiteData\n\n' +
    sd.slice(sdNext + 1);
  // Replace sampleSiteData references in JSX (after the declaration)
  const marker = 'const activeSiteData';
  const markerPos = sd.indexOf(marker);
  const afterMarker = sd.indexOf('\n\n', markerPos);
  const before = sd.slice(0, afterMarker);
  const after = sd.slice(afterMarker).replace(/sampleSiteData([.\[,)}])/g, 'activeSiteData$1');
  sd = before + after;
  fs.writeFileSync('components/SiteDashboard.tsx', sd);
  console.log('3. SiteDashboard.tsx updated');
}

// 4. Update DistrictDashboard.tsx
let dd = fs.readFileSync('components/DistrictDashboard.tsx', 'utf8');
if (!dd.includes('selectedSiteId')) {
  dd = dd.replace(
    "import { PATHWAYS, ROOT_CAUSES } from '@/lib/supabase'",
    "import { PATHWAYS, ROOT_CAUSES } from '@/lib/supabase'\nimport { getSiteById, SITES } from '@/lib/sites'"
  );
  dd = dd.replace(
    'interface DistrictDashboardProps {\n  language: Language\n  translations: Translations\n}',
    'interface DistrictDashboardProps {\n  language: Language\n  translations: Translations\n  selectedSiteId?: number | null\n}'
  );
  dd = dd.replace(
    'DistrictDashboard({ language, translations: t }: DistrictDashboardProps)',
    'DistrictDashboard({ language, translations: t, selectedSiteId }: DistrictDashboardProps)'
  );
  const ddFunc = dd.indexOf('export default function DistrictDashboard');
  const ddBody = dd.indexOf('{', ddFunc + 60);
  const ddNext = dd.indexOf('\n', ddBody);
  dd = dd.slice(0, ddNext + 1) +
    '\n  const selectedSite = selectedSiteId ? getSiteById(selectedSiteId) : null\n' +
    '  const districtSites = selectedSite ? SITES.filter(s => s.district === selectedSite.district) : []\n' +
    '  const activeDistrictData = selectedSite ? { ...sampleDistrictData, name: selectedSite.district + " District", province: selectedSite.province, totalSites: districtSites.length, sitesByType: { puskesmas: districtSites.filter(s => s.facilityType === "Puskesmas").length, hospital: districtSites.filter(s => s.facilityType === "Hospital").length, private: districtSites.filter(s => s.facilityType === "NGO clinic").length } } : sampleDistrictData\n\n' +
    dd.slice(ddNext + 1);
  const ddMarker = 'const activeDistrictData';
  const ddMarkerPos = dd.indexOf(ddMarker);
  const ddAfterMarker = dd.indexOf('\n\n', ddMarkerPos);
  const ddBefore = dd.slice(0, ddAfterMarker);
  const ddAfter = dd.slice(ddAfterMarker).replace(/sampleDistrictData([.\[,)}])/g, 'activeDistrictData$1');
  dd = ddBefore + ddAfter;
  fs.writeFileSync('components/DistrictDashboard.tsx', dd);
  console.log('4. DistrictDashboard.tsx updated');
}

console.log('\nDone! Now run: git add -A && git commit -m "Connect dashboards to site selection" && git push origin main');
