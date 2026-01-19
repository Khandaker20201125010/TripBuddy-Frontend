'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Eye, User, Globe, Cookie, ShieldCheck, ChevronDown } from 'lucide-react'

const sections = [
  {
    id: 'introduction',
    title: 'Introduction',
    icon: <Shield className="h-5 w-5" />,
    content: `Welcome to Travel Buddy's Privacy Policy. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy policy, or our practices with regards to your personal information, please contact us at privacy@travelbuddy.com.`
  },
  {
    id: 'information-we-collect',
    title: 'Information We Collect',
    icon: <Eye className="h-5 w-5" />,
    content: `We collect personal information that you voluntarily provide to us when you register on the platform, express an interest in obtaining information about us or our products and services, when you participate in activities on the platform, or otherwise when you contact us.

The personal information we collect may include:
- Name and contact details
- Profile information and photos
- Travel preferences and history
- Payment information
- Communication data
- Location data (with your consent)

We also automatically collect certain information when you visit, use, or navigate the platform. This information does not reveal your specific identity but may include device and usage information.`
  },
  {
    id: 'how-we-use-information',
    title: 'How We Use Your Information',
    icon: <User className="h-5 w-5" />,
    content: `We use personal information collected via our platform for a variety of business purposes described below:
- To facilitate account creation and authentication
- To connect you with compatible travel companions
- To provide and manage travel planning features
- To send administrative information
- To protect our services and users
- To respond to user inquiries and offer support
- To send marketing and promotional communications
- For business transfers and legal compliance`
  },
  {
    id: 'sharing-information',
    title: 'Sharing Your Information',
    icon: <Globe className="h-5 w-5" />,
    content: `We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.

We may process or share your data based on:
- Business Transfers: We may share or transfer your information in connection with any merger, sale of company assets, financing, or acquisition.
- Business Partners: We may share your information with our business partners to offer you certain products, services, or promotions.
- Other Users: When you share personal information or interact with public areas of the platform, such information may be viewed by all users.

We do not sell your personal information to third parties.`
  },
  {
    id: 'cookies',
    title: 'Cookies and Tracking',
    icon: <Cookie className="h-5 w-5" />,
    content: `We use cookies and similar tracking technologies to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy.

Types of cookies we use:
- Essential cookies: Required for basic platform functionality
- Performance cookies: Help us understand how visitors interact
- Functional cookies: Enable enhanced functionality
- Targeting cookies: Used to deliver relevant advertisements

You can control cookies through your browser settings.`
  },
  {
    id: 'data-security',
    title: 'Data Security',
    icon: <ShieldCheck className="h-5 w-5" />,
    content: `We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.

We protect your personal information by:
- Using encryption for data transmission
- Implementing access controls
- Regular security assessments
- Employee training on data protection
- Secure data storage solutions

Please contact us immediately if you have any reason to believe that your interaction with us is no longer secure.`
  },
  {
    id: 'data-retention',
    title: 'Data Retention',
    icon: <Eye className="h-5 w-5" />,
    content: `We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law.

When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information.

Account data is typically retained for 3 years after account deletion for legal compliance purposes.`
  },
  {
    id: 'your-rights',
    title: 'Your Privacy Rights',
    icon: <User className="h-5 w-5" />,
    content: `Depending on your location, you may have certain rights regarding your personal information:
- Right to access: Request copies of your personal data
- Right to rectification: Request correction of inaccurate data
- Right to erasure: Request deletion of your personal data
- Right to restrict processing: Request restriction of processing
- Right to data portability: Request transfer of your data
- Right to object: Object to processing of your data

To exercise these rights, please contact us using the contact details provided. We will respond to your request within 30 days.`
  },
  {
    id: 'children-privacy',
    title: "Children's Privacy",
    icon: <Shield className="h-5 w-5" />,
    content: `Our platform is not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you become aware that a child has provided us with personal information, please contact us immediately.

If we become aware that we have collected personal information from children without verification of parental consent, we take steps to remove that information from our servers.`
  },
  {
    id: 'policy-updates',
    title: 'Policy Updates',
    icon: <ShieldCheck className="h-5 w-5" />,
    content: `We may update this privacy policy from time to time. The updated version will be indicated by an updated "Last updated" date and the updated version will be effective as soon as it is accessible.

We encourage you to review this privacy policy frequently to be informed of how we are protecting your information.

If we make material changes to this privacy policy, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification.`
  }
]

export function PrivacyPolicyContent() {
  const [openSection, setOpenSection] = useState<string | null>('introduction')

  const toggleSection = (sectionId: string) => {
    setOpenSection(openSection === sectionId ? null : sectionId)
  }

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
          <div className="text-3xl font-bold text-blue-700 mb-2">100%</div>
          <div className="text-sm font-medium text-blue-600">Data Ownership</div>
          <p className="text-xs text-blue-700/70 mt-1">You own your data, always</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
          <div className="text-3xl font-bold text-green-700 mb-2">256-bit</div>
          <div className="text-sm font-medium text-green-600">Encryption</div>
          <p className="text-xs text-green-700/70 mt-1">Bank-level security</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-2xl p-6">
          <div className="text-3xl font-bold text-purple-700 mb-2">No Sale</div>
          <div className="text-sm font-medium text-purple-600">Policy</div>
          <p className="text-xs text-purple-700/70 mt-1">We never sell your data</p>
        </div>
      </div>

      {/* Policy Sections */}
      <div className="space-y-4">
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

      {/* Contact Information */}
      <div className="mt-12 bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-200 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-stone-900 mb-4">
          Contact Our Privacy Team
        </h3>
        <p className="text-stone-600 mb-6">
          If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact us:
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-stone-900 mb-2">Email</h4>
            <a 
              href="mailto:privacy@travelbuddy.com" 
              className="text-orange-600 hover:text-orange-700 hover:underline"
            >
              privacy@travelbuddy.com
            </a>
          </div>
          <div>
            <h4 className="font-semibold text-stone-900 mb-2">Mailing Address</h4>
            <p className="text-stone-600">
              Travel Buddy Inc.<br />
              Privacy Office<br />
              123 Travel Street<br />
              San Francisco, CA 94107
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="font-semibold text-stone-900 mb-2">Response Time</h4>
          <p className="text-stone-600">
            We aim to respond to all privacy-related inquiries within 30 days.
          </p>
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-8 text-center text-sm text-stone-500">
        <p>
          This Privacy Policy was last updated on {new Date().toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })}.
        </p>
        <p className="mt-2">
          Previous versions are available upon request.
        </p>
      </div>
    </div>
  )
}