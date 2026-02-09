-- MentorLog Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Districts table
CREATE TABLE districts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  province VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mentors table
CREATE TABLE mentors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  mentor_type VARCHAR(50) NOT NULL CHECK (mentor_type IN ('district', 'provincial', 'national')),
  district_id UUID REFERENCES districts(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sites table
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  site_type VARCHAR(50) NOT NULL CHECK (site_type IN ('puskesmas', 'hospital', 'private', 'community')),
  district_id UUID NOT NULL REFERENCES districts(id),
  province VARCHAR(255) NOT NULL,
  patients_on_treatment INTEGER DEFAULT 0,
  current_pathway VARCHAR(50) NOT NULL CHECK (current_pathway IN ('prioritization', 'rationalization', 'transition-ready', 'graduation', 're-engagement')),
  assigned_mentor_id UUID REFERENCES mentors(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quarterly Performance table
CREATE TABLE quarterly_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  quarter VARCHAR(10) NOT NULL, -- e.g., '2025-Q1'
  indicator_1_1 DECIMAL(5,2), -- Enrollment
  indicator_2_1 DECIMAL(5,2), -- ART Initiation
  indicator_3_1 DECIMAL(5,2), -- CD4 Testing
  indicator_4_1 DECIMAL(5,2), -- Treatment Continuity
  indicator_5_1 DECIMAL(5,2), -- MMD
  indicator_6_1 DECIMAL(5,2), -- VL Testing
  pathway_assignment VARCHAR(50) NOT NULL CHECK (pathway_assignment IN ('prioritization', 'rationalization', 'transition-ready', 'graduation', 're-engagement')),
  patients_on_treatment INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  UNIQUE(site_id, quarter)
);

-- Support Logs table
CREATE TABLE support_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES mentors(id),
  quarter VARCHAR(10) NOT NULL,
  support_date DATE NOT NULL,
  modality VARCHAR(50) NOT NULL CHECK (modality IN ('face-to-face', 'remote', 'data-review', 'training', 'peer-learning', 'sop-development')),
  duration_minutes INTEGER NOT NULL,
  indicators_addressed TEXT[], -- Array of indicator codes like ['1.1', '4.1']
  root_causes_identified TEXT[], -- Array of root cause codes
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Root Cause Logs table
CREATE TABLE root_cause_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  quarter VARCHAR(10) NOT NULL,
  root_cause VARCHAR(50) NOT NULL CHECK (root_cause IN ('staffing', 'capacity', 'me-data', 'supply-chain', 'policy-sops', 'service-delivery', 'patient-factors', 'leadership')),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved')),
  identified_date DATE NOT NULL,
  resolved_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_sites_district ON sites(district_id);
CREATE INDEX idx_sites_pathway ON sites(current_pathway);
CREATE INDEX idx_quarterly_site ON quarterly_performance(site_id);
CREATE INDEX idx_quarterly_quarter ON quarterly_performance(quarter);
CREATE INDEX idx_support_site ON support_logs(site_id);
CREATE INDEX idx_support_quarter ON support_logs(quarter);
CREATE INDEX idx_root_cause_site ON root_cause_logs(site_id);

-- Function to update site's updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_sites_updated_at
  BEFORE UPDATE ON sites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing

-- Sample Districts
INSERT INTO districts (id, name, province) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'East Jakarta', 'DKI Jakarta'),
  ('d1000000-0000-0000-0000-000000000002', 'South Jakarta', 'DKI Jakarta'),
  ('d1000000-0000-0000-0000-000000000003', 'Tangerang', 'Banten');

-- Sample Mentors
INSERT INTO mentors (id, name, phone, mentor_type, district_id) VALUES
  ('m1000000-0000-0000-0000-000000000001', 'Dewi Suryani', '+6281234567890', 'district', 'd1000000-0000-0000-0000-000000000001'),
  ('m1000000-0000-0000-0000-000000000002', 'Budi Santoso', '+6281234567891', 'district', 'd1000000-0000-0000-0000-000000000001'),
  ('m1000000-0000-0000-0000-000000000003', 'Rina Wijaya', '+6281234567892', 'district', 'd1000000-0000-0000-0000-000000000001');

-- Sample Sites
INSERT INTO sites (id, name, site_type, district_id, province, patients_on_treatment, current_pathway, assigned_mentor_id) VALUES
  ('s1000000-0000-0000-0000-000000000001', 'PKM Kramat Jati', 'puskesmas', 'd1000000-0000-0000-0000-000000000001', 'DKI Jakarta', 342, 'rationalization', 'm1000000-0000-0000-0000-000000000001'),
  ('s1000000-0000-0000-0000-000000000002', 'PKM Pasar Minggu', 'puskesmas', 'd1000000-0000-0000-0000-000000000001', 'DKI Jakarta', 215, 'transition-ready', 'm1000000-0000-0000-0000-000000000002'),
  ('s1000000-0000-0000-0000-000000000003', 'RS Persahabatan', 'hospital', 'd1000000-0000-0000-0000-000000000001', 'DKI Jakarta', 523, 'prioritization', 'm1000000-0000-0000-0000-000000000001'),
  ('s1000000-0000-0000-0000-000000000004', 'PKM Tebet', 'puskesmas', 'd1000000-0000-0000-0000-000000000001', 'DKI Jakarta', 178, 'graduation', 'm1000000-0000-0000-0000-000000000003'),
  ('s1000000-0000-0000-0000-000000000005', 'PKM Cipinang', 'puskesmas', 'd1000000-0000-0000-0000-000000000001', 'DKI Jakarta', 289, 'rationalization', 'm1000000-0000-0000-0000-000000000002');

-- Sample Quarterly Performance (multiple quarters for PKM Kramat Jati)
INSERT INTO quarterly_performance (site_id, quarter, indicator_1_1, indicator_2_1, indicator_3_1, indicator_4_1, indicator_5_1, indicator_6_1, pathway_assignment, patients_on_treatment) VALUES
  ('s1000000-0000-0000-0000-000000000001', '2024-Q1', 85, 55, 65, 85, 45, 70, 'prioritization', 298),
  ('s1000000-0000-0000-0000-000000000001', '2024-Q2', 85, 60, 70, 86, 48, 75, 'prioritization', 312),
  ('s1000000-0000-0000-0000-000000000001', '2024-Q3', 88, 62, 72, 86, 52, 78, 'rationalization', 325),
  ('s1000000-0000-0000-0000-000000000001', '2024-Q4', 88, 68, 75, 87, 52, 80, 'rationalization', 338),
  ('s1000000-0000-0000-0000-000000000001', '2025-Q1', 92, 65, 78, 87, 58, 82, 'rationalization', 342);

-- Sample Quarterly Performance for other sites (current quarter only)
INSERT INTO quarterly_performance (site_id, quarter, indicator_1_1, indicator_2_1, indicator_3_1, indicator_4_1, indicator_5_1, indicator_6_1, pathway_assignment, patients_on_treatment) VALUES
  ('s1000000-0000-0000-0000-000000000002', '2025-Q1', 96, 82, 85, 98, 78, 88, 'transition-ready', 215),
  ('s1000000-0000-0000-0000-000000000003', '2025-Q1', 78, 52, 58, 88, 35, 72, 'prioritization', 523),
  ('s1000000-0000-0000-0000-000000000004', '2025-Q1', 97, 85, 88, 99, 82, 92, 'graduation', 178),
  ('s1000000-0000-0000-0000-000000000005', '2025-Q1', 90, 72, 75, 94, 62, 80, 'rationalization', 289);

-- Sample Support Logs for PKM Kramat Jati
INSERT INTO support_logs (site_id, mentor_id, quarter, support_date, modality, duration_minutes, indicators_addressed, root_causes_identified, notes) VALUES
  ('s1000000-0000-0000-0000-000000000001', 'm1000000-0000-0000-0000-000000000001', '2024-Q2', '2024-04-15', 'face-to-face', 180, ARRAY['4.1', '5.1'], ARRAY['staffing', 'capacity'], 'Initial assessment visit'),
  ('s1000000-0000-0000-0000-000000000001', 'm1000000-0000-0000-0000-000000000001', '2024-Q2', '2024-05-10', 'face-to-face', 150, ARRAY['4.1'], ARRAY['staffing'], 'Follow-up on data entry backlog'),
  ('s1000000-0000-0000-0000-000000000001', 'm1000000-0000-0000-0000-000000000001', '2024-Q3', '2024-07-22', 'face-to-face', 120, ARRAY['4.1', '2.1'], ARRAY['staffing'], 'ART initiation process review'),
  ('s1000000-0000-0000-0000-000000000001', 'm1000000-0000-0000-0000-000000000001', '2024-Q3', '2024-08-18', 'remote', 60, ARRAY['5.1'], ARRAY['supply-chain'], 'MMD supply chain discussion'),
  ('s1000000-0000-0000-0000-000000000001', 'm1000000-0000-0000-0000-000000000001', '2024-Q4', '2024-10-05', 'face-to-face', 120, ARRAY['4.1'], ARRAY['staffing'], 'Continuity improvement planning'),
  ('s1000000-0000-0000-0000-000000000001', 'm1000000-0000-0000-0000-000000000001', '2024-Q4', '2024-11-12', 'data-review', 90, ARRAY['1.1', '6.1'], ARRAY['me-data'], 'Data quality review'),
  ('s1000000-0000-0000-0000-000000000001', 'm1000000-0000-0000-0000-000000000001', '2025-Q1', '2025-01-20', 'face-to-face', 120, ARRAY['4.1', '2.1'], ARRAY['staffing'], 'Q1 support visit'),
  ('s1000000-0000-0000-0000-000000000001', 'm1000000-0000-0000-0000-000000000001', '2025-Q1', '2025-02-08', 'remote', 60, ARRAY['5.1'], ARRAY['me-data'], 'MMD tracking follow-up'),
  ('s1000000-0000-0000-0000-000000000001', 'm1000000-0000-0000-0000-000000000001', '2025-Q1', '2025-02-25', 'data-review', 90, ARRAY['1.1', '4.1'], ARRAY['staffing', 'me-data'], 'Monthly data review');

-- Sample Root Cause Logs for PKM Kramat Jati
INSERT INTO root_cause_logs (site_id, quarter, root_cause, status, identified_date, resolved_date) VALUES
  ('s1000000-0000-0000-0000-000000000001', '2024-Q2', 'staffing', 'active', '2024-04-15', NULL),
  ('s1000000-0000-0000-0000-000000000001', '2024-Q2', 'capacity', 'resolved', '2024-04-15', '2024-10-30'),
  ('s1000000-0000-0000-0000-000000000001', '2024-Q3', 'supply-chain', 'resolved', '2024-08-18', '2024-09-25'),
  ('s1000000-0000-0000-0000-000000000001', '2025-Q1', 'me-data', 'active', '2025-02-08', NULL);

-- Enable Row Level Security (optional, for future auth)
-- ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE quarterly_performance ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE support_logs ENABLE ROW LEVEL SECURITY;
