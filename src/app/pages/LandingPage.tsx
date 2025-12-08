'use client'
import { AIFeature } from '@/components/modules/home/AIFeature';
import { Destinations } from '@/components/modules/home/Destinations';
import { Hero } from '@/components/modules/home/Hero';
import { HowItWorks } from '@/components/modules/home/HowItWorks';
import { Pricing } from '@/components/modules/home/Pricing';
import { Testimonials } from '@/components/modules/home/Testimonials';


const LandingPage = () => {
    return (
        <div>
            <Hero />
            <HowItWorks />
            <AIFeature />
            <Destinations />
            <Testimonials />
            <Pricing />
        </div>
    );
};

export default LandingPage;