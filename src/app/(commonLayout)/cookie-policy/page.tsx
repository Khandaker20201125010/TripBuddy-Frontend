import { CookiePolicyContent } from '@/components/legal/CookiePolicyContent'
import { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Cookie Policy | Travel Buddy',
  description: 'Learn about how we use cookies on our platform',
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50/50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="block text-stone-900">Cookie Policy</span>
          </h1>
          <p className="text-xl text-stone-600">
            Learn how we use cookies to enhance your experience
          </p>
        </div>

        <CookiePolicyContent />
      </div>
    </div>
  )
}