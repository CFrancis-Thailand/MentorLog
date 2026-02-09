# MentorLog (Catatan Pendamping)

AI-assisted mentorship tracking tool for EpiC Indonesia's Sustainable Excellence framework. Captures technical support delivery via WhatsApp, tracks site performance against 6 core HIV cascade indicators, and visualizes pathway progression toward self-reliance.

## Features

- **Quarterly Data Entry**: Enter site performance against 6 core indicators with automatic status calculation
- **Site Dashboard**: Track pathway progression, indicators at target, support history, and root cause resolution
- **District Dashboard**: Aggregate views, pathway distribution, mentor activity, and system-level escalations
- **WhatsApp Integration** (Phase 2): Mentors log support through natural conversation

## Tech Stack

- **Framework**: Next.js 14
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Charts**: Chart.js
- **AI**: Claude API (for WhatsApp parsing)

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Vercel account (for deployment)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/CFrancis-Thailand/MentorLog.git
   cd MentorLog
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Add your Supabase credentials to `.env.local`

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Database Setup

Run the SQL schema in your Supabase SQL Editor. See `/lib/schema.sql` for the complete database structure.

## Performance Thresholds

Based on the Sustainable Excellence Framework:

| Indicator | Optimal | Effective | Improving | Sub | Stressed |
|-----------|---------|-----------|-----------|-----|----------|
| 1.1 Enrollment | >95% | 90-94% | 85-89% | 80-84% | <80% |
| 2.1 ART Initiation | >80% | 70-79% | 60-69% | 50-59% | <50% |
| 3.1 CD4 Testing | >80% | 70-79% | 60-69% | 50-59% | <50% |
| 4.1 Treatment Continuity | >98% | 96-97% | 92-95% | 90-91% | <90% |
| 5.1 MMD | >75% | 65-74% | 55-64% | 45-54% | <45% |
| 6.1 VL Testing | >86% | 80-85% | 75-79% | 70-74% | <70% |

## License

Private - EpiC Indonesia / FHI 360
