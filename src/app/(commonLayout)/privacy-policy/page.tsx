import { PrivacyPolicyContent } from '@/components/legal/PrivacyPolicyContent'
import { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Privacy Policy | Travel Buddy',
  description: 'Learn how we protect your privacy and handle your data',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50/50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="block text-stone-900">Privacy Policy</span>
          </h1>
          <p className="text-xl text-stone-600">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <PrivacyPolicyContent />
      </div>
    </div>
  )
}