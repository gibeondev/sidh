import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SIDH',
  description: 'Student Information and Document Hub',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
