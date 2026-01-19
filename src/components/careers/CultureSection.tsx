/* eslint-disable react/no-unescaped-entities */
'use client'
import { motion } from 'framer-motion'
import { Quote, Users, Target, Zap, Heart, TrendingUp } from 'lucide-react'

const cultureValues = [
  {
    icon: <Users className="h-8 w-8" />,
    title: 'Collaborative Spirit',
    description: 'We believe great ideas come from working together across teams.',
    highlight: 'Weekly cross-team syncs'
  },
  {
    icon: <Target className="h-8 w-8" />,
    title: 'Impact-Driven',
    description: 'Every role contributes directly to helping travelers connect.',
    highlight: 'Clear OKRs & goals'
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: 'Fast-Paced Innovation',
    description: 'Move quickly, experiment, and learn from both successes and failures.',
    highlight: 'Bi-weekly hackathons'
  },
  {
    icon: <Heart className="h-8 w-8" />,
    title: 'Empathy First',
    description: 'Understand our users\' needs and build experiences they\'ll love.',
    highlight: 'Regular user interviews'
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: 'Continuous Growth',
    description: 'Invest in personal and professional development for everyone.',
    highlight: 'Mentorship programs'
  }
]

const testimonials = [
  {
    quote: "Working at Travel Buddy doesn't feel like work. I get to build technology that helps people form real connections.",
    author: "Sarah L.",
    role: "Senior Engineer",
    tenure: "2 years"
  },
  {
    quote: "The culture of trust and autonomy here is incredible. I've grown more in one year than in five years at my previous company.",
    author: "Michael T.",
    role: "Product Manager",
    tenure: "1 year"
  },
  {
    quote: "Seeing the impact we make on people's travel experiences is incredibly rewarding. It's more than just a job.",
    author: "Jessica R.",
    role: "Community Manager",
    tenure: "3 years"
  }
]

export function CultureSection() {
  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
          Our Culture
        </h2>
        <p className="text-xl text-stone-600 max-w-3xl mx-auto">
          More than coworkers - we're a team of passionate travelers building something meaningful
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {cultureValues.map((value, index) => (
          <motion.div
            key={value.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl border border-stone-200 p-8 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 mb-6">
              <div className="text-white">
                {value.icon}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-stone-900 mb-3">
              {value.title}
            </h3>
            <p className="text-stone-600 mb-4">
              {value.description}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium">
              {value.highlight}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Team Testimonials */}
      <div className="mb-16">
        <h3 className="text-3xl font-bold text-stone-900 text-center mb-8">
          Hear From Our Team
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-stone-200 p-8 relative"
            >
              <Quote className="h-8 w-8 text-orange-200 absolute top-6 left-6" />
              <p className="text-lg text-stone-700 mb-6 pl-4">
                "{testimonial.quote}"
              </p>
              <div className="border-t border-stone-100 pt-6">
                <div className="font-bold text-stone-900">{testimonial.author}</div>
                <div className="text-sm text-stone-600">{testimonial.role}</div>
                <div className="text-xs text-stone-500 mt-1">{testimonial.tenure} at Travel Buddy</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Daily Life */}
      <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-3xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-white mb-4">
            A Day at Travel Buddy
          </h3>
          <p className="text-stone-300 max-w-2xl mx-auto">
            Here's what a typical day looks like for our team
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              time: '9:00 AM',
              activity: 'Daily Standup',
              desc: 'Team sync on goals and priorities'
            },
            {
              time: '10:00 AM',
              activity: 'Focus Time',
              desc: 'Deep work on projects'
            },
            {
              time: '12:00 PM',
              activity: 'Team Lunch',
              desc: 'Virtual or in-person connection'
            },
            {
              time: '2:00 PM',
              activity: 'Collaboration',
              desc: 'Meetings and pair programming'
            },
            {
              time: '4:00 PM',
              activity: 'User Feedback',
              desc: 'Review user stories and insights'
            },
            {
              time: '5:00 PM',
              activity: 'Learning Hour',
              desc: 'Skill sharing sessions'
            },
            {
              time: '6:00 PM',
              activity: 'Wellness Break',
              desc: 'Yoga, meditation, or walk'
            },
            {
              time: 'Flexible',
              activity: 'Personal Time',
              desc: 'Family, hobbies, rest'
            }
          ].map((item, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-lg font-bold text-white mb-1">{item.time}</div>
              <div className="text-sm font-medium text-orange-300 mb-2">{item.activity}</div>
              <div className="text-xs text-stone-300">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="text-center mt-16">
        <a
          href="#job-listings"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all text-lg"
        >
          View Open Positions
          <span>→</span>
        </a>
        <p className="text-stone-600 mt-4">
          Don't see a perfect fit?{' '}
          <a href="mailto:careers@travelbuddy.com" className="text-orange-600 hover:underline font-medium">
            Send us your resume
          </a>
        </p>
      </div>
    </div>
  )
}