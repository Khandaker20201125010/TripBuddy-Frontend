import { TermsContent } from '@/components/legal/TermsContent'
import { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Terms of Service | Travel Buddy',
  description: 'Terms and conditions for using Travel Buddy',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50/50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="block text-stone-900">Terms of Service</span>
          </h1>
          <p className="text-xl text-stone-600">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <TermsContent />
      </div>
    </div>
  )
}