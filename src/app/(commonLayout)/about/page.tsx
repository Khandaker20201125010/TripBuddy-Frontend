import { Metadata } from 'next'
import { TeamSection } from '@/components/about/TeamSection'
import { StatsSection } from '@/components/about/StatsSection'
import { ValuesSection } from '@/components/about/ValuesSection'
import { HeroSection } from '@/components/about/HeroSection'

export const metadata: Metadata = {
  title: 'About Us | Travel Buddy',
  description: 'Learn about Travel Buddy - connecting travelers worldwide since 2024',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50/50">
      <HeroSection />
      <ValuesSection />
      <StatsSection />
      <TeamSection />
    </div>
  )
}