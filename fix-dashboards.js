const fs = require('fs');

// 1. Fix SiteDashboard - add site selector dropdown
let sd = fs.readFileSync('components/SiteDashboard.tsx', 'utf8');

// Add SITES import if not present
if (!sd.includes("from '@/lib/sites'")) {
  sd = sd.replace(
    "import { useState, useEffect, useRef } from 'react'",
    "import { useState, useEffect, useRef } from 'react'\nimport { SITES, getSiteById, PROVINCES, getDistrictsByProvince, type Site } from '@/lib/sites'"
  );
}

// Add site selection state inside the component function
if (!sd.includes('dashboardSiteId')) {
  // Find the function body start
  const funcMatch = sd.match(/export default function SiteDashboard\([^)]*\)\s*\{/);
  if (funcMatch) {
    const insertPos = sd.indexOf(funcMatch[0]) + funcMatch[0].length;
    const siteSelector = `
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
`;
    sd = sd.slice(0, insertPos) + siteSelector + sd.slice(insertPos);
  }

  // Now replace the hardcoded site name display with dynamic + selector
  // Look for the site name heading pattern
  const namePatterns = [
    { find: '{sampleSiteData.name}', replace: '{displaySiteData.name}' },
    { find: '{activeSiteData.name}', replace: '{displaySiteData.name}' },
    { find: 'sampleSiteData.name', replace: 'displaySiteData.name' },
    { find: 'sampleSiteData.district', replace: 'displaySiteData.district' },
    { find: 'sampleSiteData.province', replace: 'displaySiteData.province' },
    { find: 'sampleSiteData.siteType', replace: 'displaySiteData.siteType' },
    { find: 'activeSiteData.name', replace: 'displaySiteData.name' },
    { find: 'activeSiteData.district', replace: 'displaySiteData.district' },
    { find: 'activeSiteData.province', replace: 'displaySiteData.province' },
    { find: 'activeSiteData.siteType', replace: 'displaySiteData.siteType' },
  ];
  
  namePatterns.forEach(p => {
    sd = sd.split(p.find).join(p.replace);
  });

  // Add the site selector dropdown before the site name heading
  // Find the h1/h2 that shows the site name
  const headingMatch = sd.match(/<h[12][^>]*>[\s\S]*?displaySiteData\.name[\s\S]*?<\/h[12]>/);
  if (headingMatch) {
    const headingPos = sd.indexOf(headingMatch[0]);
    const selectorUI = `<div className="mb-4 flex items-center gap-3">
              <label className="text-sm font-medium text-gray-600">Select Site:</label>
              <select 
                value={dashboardSiteId} 
                onChange={(e) => setDashboardSiteId(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm min-w-[300px]"
              >
                {SITES.map(s => (
                  <option key={s.id} value={s.id}>{s.name} — {s.district}, {s.province}</option>
                ))}
              </select>
            </div>
            `;
    sd = sd.slice(0, headingPos) + selectorUI + sd.slice(headingPos);
  }

  fs.writeFileSync('components/SiteDashboard.tsx', sd);
  console.log('1. SiteDashboard.tsx updated with site selector');
}

// 2. Fix DistrictDashboard - add district selector
let dd = fs.readFileSync('components/DistrictDashboard.tsx', 'utf8');

if (!dd.includes("from '@/lib/sites'")) {
  dd = dd.replace(
    "import { useState, useEffect, useRef } from 'react'",
    "import { useState, useEffect, useRef } from 'react'\nimport { SITES, PROVINCES, getDistrictsByProvince } from '@/lib/sites'"
  );
}

if (!dd.includes('selectedDistrictName')) {
  const ddFuncMatch = dd.match(/export default function DistrictDashboard\([^)]*\)\s*\{/);
  if (ddFuncMatch) {
    const ddInsertPos = dd.indexOf(ddFuncMatch[0]) + ddFuncMatch[0].length;
    const districtSelector = `
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
`;
    dd = dd.slice(0, ddInsertPos) + districtSelector + dd.slice(ddInsertPos);
  }

  // Replace all sampleDistrictData and activeDistrictData references
  const ddPatterns = [
    { find: 'sampleDistrictData.name', replace: 'displayDistrictData.name' },
    { find: 'sampleDistrictData.province', replace: 'displayDistrictData.province' },
    { find: 'sampleDistrictData.totalSites', replace: 'displayDistrictData.totalSites' },
    { find: 'sampleDistrictData.sitesByType', replace: 'displayDistrictData.sitesByType' },
    { find: 'activeDistrictData.name', replace: 'displayDistrictData.name' },
    { find: 'activeDistrictData.province', replace: 'displayDistrictData.province' },
    { find: 'activeDistrictData.totalSites', replace: 'displayDistrictData.totalSites' },
    { find: 'activeDistrictData.sitesByType', replace: 'displayDistrictData.sitesByType' },
  ];
  
  ddPatterns.forEach(p => {
    dd = dd.split(p.find).join(p.replace);
  });

  // Add district selector UI before the district name heading
  const ddHeadingMatch = dd.match(/<h[12][^>]*>[\s\S]*?(?:displayDistrictData|sampleDistrictData|activeDistrictData)\.name[\s\S]*?<\/h[12]>/);
  if (ddHeadingMatch) {
    const ddHeadingPos = dd.indexOf(ddHeadingMatch[0]);
    const distSelectorUI = `<div className="mb-4 flex items-center gap-3 flex-wrap">
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
            `;
    dd = dd.slice(0, ddHeadingPos) + distSelectorUI + dd.slice(ddHeadingPos);
  }

  fs.writeFileSync('components/DistrictDashboard.tsx', dd);
  console.log('2. DistrictDashboard.tsx updated with district selector');
}

console.log('\nDone! Dashboards now have selectors showing your 146 real sites.');
console.log('Next: git add -A && git commit -m "Add site/district selectors to dashboards" && git push origin main');
