import type { Metadata } from 'next'
import './globals.css'
import AuthWrapper from '../components/AuthWrapper'

export const metadata: Metadata = {
  title: 'MentorLog | Catatan Pendamping',
  description: 'AI-assisted mentorship tracking for EpiC Indonesia',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <AuthWrapper>
          {children}
        </AuthWrapper>
      </body>
    </html>
  )
}
