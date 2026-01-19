'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, DollarSign, Clock, Briefcase, ChevronDown } from 'lucide-react'

const jobCategories = ['All', 'Engineering', 'Design', 'Marketing', 'Operations', 'Customer Support']

const jobListings = [
  {
    id: 1,
    title: 'Senior Full Stack Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    salary: '$130,000 - $180,000',
    description: 'Build and scale our travel matching platform using modern technologies.',
    requirements: ['5+ years experience', 'React & Node.js', 'AWS/Azure', 'PostgreSQL']
  },
  {
    id: 2,
    title: 'Product Designer',
    department: 'Design',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$100,000 - $140,000',
    description: 'Design intuitive experiences for travelers finding companions.',
    requirements: ['3+ years UX/UI', 'Figma proficiency', 'User research', 'Prototyping']
  },
  {
    id: 3,
    title: 'Growth Marketing Manager',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
    salary: '$90,000 - $130,000',
    description: 'Drive user acquisition and community growth strategies.',
    requirements: ['4+ years marketing', 'Paid social experience', 'Analytics', 'Content strategy']
  },
  {
    id: 4,
    title: 'Community Success Specialist',
    department: 'Customer Support',
    location: 'Remote',
    type: 'Full-time',
    salary: '$65,000 - $85,000',
    description: 'Help travelers have safe and enjoyable experiences.',
    requirements: ['2+ years support', 'Excellent communication', 'Problem solving', 'Travel passion']
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    salary: '$120,000 - $160,000',
    description: 'Maintain and improve our infrastructure and deployment pipelines.',
    requirements: ['3+ years DevOps', 'Kubernetes', 'CI/CD', 'Monitoring tools']
  },
  {
    id: 6,
    title: 'Content Strategist',
    department: 'Marketing',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$80,000 - $110,000',
    description: 'Create compelling travel content and stories.',
    requirements: ['3+ years content', 'SEO knowledge', 'Storytelling', 'Social media']
  }
]

export function JobListings() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [openJobId, setOpenJobId] = useState<number | null>(null)

  const filteredJobs = selectedCategory === 'All' 
    ? jobListings 
    : jobListings.filter(job => job.department === selectedCategory)

  const toggleJob = (id: number) => {
    setOpenJobId(openJobId === id ? null : id)
  }

  return (
    <div className="mb-16">
      <div className="flex flex-wrap gap-3 mb-8">
        {jobCategories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <button
                onClick={() => toggleJob(job.id)}
                className="w-full p-6 text-left"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-stone-900 mb-2">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-3 mb-3">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                        <Briefcase className="h-3 w-3" />
                        {job.department}
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm">
                        <Clock className="h-3 w-3" />
                        {job.type}
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm">
                        <DollarSign className="h-3 w-3" />
                        {job.salary}
                      </span>
                    </div>
                    <p className="text-stone-600">
                      {job.description}
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-stone-400 transition-transform duration-300 ${
                      openJobId === job.id ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              <AnimatePresence>
                {openJobId === job.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 pt-2 border-t border-stone-100">
                      <div className="mb-6">
                        <h4 className="font-semibold text-stone-900 mb-3">Requirements</h4>
                        <ul className="space-y-2">
                          {job.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2" />
                              <span className="text-stone-600">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <a
                          href={`/apply/${job.id}`}
                          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all"
                        >
                          Apply Now
                        </a>
                        <a
                          href={`/jobs/${job.id}`}
                          className="px-6 py-3 border-2 border-stone-300 text-stone-700 font-semibold rounded-full hover:border-orange-500 hover:text-orange-600 transition-all"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-stone-100 flex items-center justify-center">
            <Briefcase className="h-10 w-10 text-stone-400" />
          </div>
          <h3 className="text-2xl font-bold text-stone-900 mb-2">
            No positions available
          </h3>
          <p className="text-stone-600">
            Check back soon for new opportunities!
          </p>
        </div>
      )}
    </div>
  )
}