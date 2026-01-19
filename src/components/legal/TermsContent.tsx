'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Scale, Users, Shield, AlertCircle, BookOpen, ChevronDown } from 'lucide-react'

const sections = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    icon: <FileText className="h-5 w-5" />,
    content: `By accessing and using Travel Buddy, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.

Your continued use of the platform following the posting of any changes to these Terms of Service constitutes acceptance of those changes.`
  },
  {
    id: 'eligibility',
    title: 'Eligibility',
    icon: <Users className="h-5 w-5" />,
    content: `To be eligible to use Travel Buddy, you must:
- Be at least 18 years of age
- Have the legal capacity to enter into contracts
- Not be prohibited from receiving our services under applicable laws
- Provide accurate and complete registration information
- Maintain the security of your account credentials

We reserve the right to refuse service to anyone for any reason at any time.`
  },
  {
    id: 'user-responsibilities',
    title: 'User Responsibilities',
    icon: <Scale className="h-5 w-5" />,
    content: `As a user of Travel Buddy, you agree to:
- Provide accurate and current information
- Maintain the security of your account
- Not share your account credentials
- Use the service only for lawful purposes
- Respect other users' privacy and rights
- Not engage in harassment or discrimination
- Not post false or misleading information
- Not use the service for commercial purposes without authorization
- Comply with all applicable laws and regulations`
  },
  {
    id: 'content-guidelines',
    title: 'Content Guidelines',
    icon: <BookOpen className="h-5 w-5" />,
    content: `You are responsible for all content you post on Travel Buddy, including:
- Profile information and photos
- Travel plans and itineraries
- Reviews and ratings
- Messages and communications
- Any other user-generated content

Prohibited content includes:
- Illegal or fraudulent content
- Hate speech or discrimination
- Harassment or threats
- Sexually explicit material
- Private or confidential information
- Spam or commercial solicitations
- False or misleading information
- Copyrighted material without permission

We reserve the right to remove any content that violates these guidelines.`
  },
  {
    id: 'safety-warnings',
    title: 'Safety Warnings',
    icon: <AlertCircle className="h-5 w-5" />,
    content: `Travel Buddy is a platform for connecting travelers. We are not responsible for your safety when meeting other users in person.

Important safety guidelines:
- Always meet in public places initially
- Inform friends or family about your plans
- Trust your instincts
- Do not share financial information
- Verify the identity of other users
- Use our in-app messaging until comfortable
- Research destinations thoroughly
- Purchase travel insurance
- Follow local laws and customs

We strongly recommend using common sense and caution when meeting new people through our platform.`
  },
  {
    id: 'subscriptions',
    title: 'Subscriptions and Payments',
    icon: <Scale className="h-5 w-5" />,
    content: `Travel Buddy offers both free and premium subscription plans:

Free Features:
- Basic profile creation
- Limited travel plan creation
- Basic search functionality
- In-app messaging

Premium Features (Subscription Required):
- Unlimited travel plans
- Advanced matching algorithms
- Priority customer support
- Additional safety features
- Premium badges

Subscription Terms:
- Billing cycles are monthly or yearly
- Automatic renewal unless canceled
- Prices subject to change with notice
- No refunds for partial periods
- Cancel anytime through account settings

All payments are processed through secure third-party payment processors.`
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    icon: <FileText className="h-5 w-5" />,
    content: `The Travel Buddy platform and its original content, features, and functionality are owned by Travel Buddy Inc. and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.

Your Content:
- You retain ownership of your content
- You grant us a license to use your content on the platform
- This license ends when you delete your content
- You are responsible for having necessary rights to your content

Platform Content:
- Do not copy, modify, or distribute platform content without permission
- Do not reverse engineer or attempt to extract source code
- Trademarks and logos may not be used without permission`
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    icon: <Shield className="h-5 w-5" />,
    content: `To the maximum extent permitted by law, Travel Buddy shall not be liable for:
- Any indirect, incidental, or consequential damages
- Loss of data, profits, or business opportunities
- Personal injury or property damage resulting from user interactions
- Actions or omissions of other users
- Technical issues or service interruptions
- Third-party services or websites

Maximum Liability:
Our total liability to you for all claims arising from or related to the service shall not exceed the amount you have paid us in the last 12 months, or $100 if you haven't made any payments.

Some jurisdictions do not allow the exclusion or limitation of liability, so these limitations may not apply to you.`
  },
  {
    id: 'termination',
    title: 'Termination',
    icon: <AlertCircle className="h-5 w-5" />,
    content: `We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including if you breach the Terms.

Upon termination:
- Your right to use the service will immediately cease
- You must stop all use of the service
- We may delete your account and content
- Some provisions will survive termination

You may terminate your account at any time by:
- Going to account settings
- Selecting "Delete Account"
- Confirming your decision
- Following the prompts

Some information may be retained for legal compliance.`
  },
  {
    id: 'disputes',
    title: 'Dispute Resolution',
    icon: <Scale className="h-5 w-5" />,
    content: `Any disputes arising from these Terms shall be resolved as follows:

1. Informal Resolution: First attempt to resolve informally through customer support
2. Mediation: If informal resolution fails, we agree to attempt mediation
3. Arbitration: If mediation fails, disputes will be resolved by binding arbitration
4. Governing Law: These Terms are governed by California law
5. Jurisdiction: Legal proceedings shall be in San Francisco, California

Class Action Waiver:
You agree to resolve disputes on an individual basis and waive any right to participate in class actions.

Time Limitation:
Any claim must be filed within one year of the event giving rise to the claim.`
  }
]

export function TermsContent() {
  const [openSection, setOpenSection] = useState<string | null>('acceptance')

  const toggleSection = (sectionId: string) => {
    setOpenSection(openSection === sectionId ? null : sectionId)
  }

  return (
    <div>
      {/* Important Notice */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-6 w-6 text-orange-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">
              Important Legal Notice
            </h3>
            <p className="text-stone-700">
              These Terms of Service constitute a legally binding agreement between you and Travel Buddy. 
              Please read them carefully. By using our platform, you agree to these terms.
            </p>
          </div>
        </div>
      </div>

      {/* Terms Sections */}
      <div className="space-y-4 mb-12">
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden"
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-stone-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500/10 to-pink-500/10">
                  <div className="text-orange-600">
                    {section.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900">
                    {section.title}
                  </h3>
                  <p className="text-sm text-stone-500 mt-1">
                    Section {index + 1} of {sections.length}
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-stone-400 transition-transform duration-300 ${
                  openSection === section.id ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            <AnimatePresence>
              {openSection === section.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-6 pb-6 pt-2 border-t border-stone-100">
                    <div className="prose prose-stone max-w-none">
                      <p className="text-stone-600 whitespace-pre-line">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* User Agreement */}
      <div className="bg-white rounded-2xl border border-stone-200 p-8 mb-8">
        <h3 className="text-2xl font-bold text-stone-900 mb-4">
          Your Agreement
        </h3>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
              <div className="w-2 h-2 rounded-full bg-green-600"></div>
            </div>
            <p className="text-stone-700">
              By using Travel Buddy, you confirm that you have read, understood, and agree to these Terms of Service.
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
              <div className="w-2 h-2 rounded-full bg-green-600"></div>
            </div>
            <p className="text-stone-700">
              You confirm that you are at least 18 years old and legally capable of entering into this agreement.
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
              <div className="w-2 h-2 rounded-full bg-green-600"></div>
            </div>
            <p className="text-stone-700">
              You understand and accept the risks associated with meeting new people through our platform.
            </p>
          </div>
        </div>
        
        <div className="border-t border-stone-100 pt-6">
          <h4 className="font-semibold text-stone-900 mb-2">Last Updated</h4>
          <p className="text-stone-600">
            These Terms of Service were last updated on {new Date().toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}.
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gradient-to-br from-stone-50 to-stone-100 border border-stone-200 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-stone-900 mb-4">
          Questions About These Terms?
        </h3>
        
        <p className="text-stone-600 mb-6">
          If you have any questions about these Terms of Service, please contact our legal team:
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-stone-900 mb-2">Legal Department</h4>
            <a 
              href="mailto:legal@travelbuddy.com" 
              className="text-orange-600 hover:text-orange-700 hover:underline block mb-2"
            >
              legal@travelbuddy.com
            </a>
            <p className="text-sm text-stone-500">
              For legal inquiries and questions about these terms
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-stone-900 mb-2">General Support</h4>
            <a 
              href="mailto:support@travelbuddy.com" 
              className="text-orange-600 hover:text-orange-700 hover:underline block mb-2"
            >
              support@travelbuddy.com
            </a>
            <p className="text-sm text-stone-500">
              For account and technical support questions
            </p>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-stone-200">
          <h4 className="font-semibold text-stone-900 mb-2">Mailing Address</h4>
          <p className="text-stone-600">
            Travel Buddy Inc.<br />
            Legal Department<br />
            123 Travel Street<br />
            San Francisco, CA 94107<br />
            United States
          </p>
        </div>
      </div>
    </div>
  )
}