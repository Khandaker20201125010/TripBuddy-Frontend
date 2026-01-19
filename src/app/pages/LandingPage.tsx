'use client'
import { AIFeature } from '@/components/modules/home/AIFeature';
import { Destinations } from '@/components/modules/home/Destinations';
import { Hero } from '@/components/modules/home/Hero';
import { HowItWorks } from '@/components/modules/home/HowItWorks';
import { Pricing } from '@/components/modules/home/Pricing';
import { Testimonials } from '@/components/modules/home/Testimonials';
import { TravelTypes } from '@/components/modules/home/TravelTypes';
import { WhyChooseUs } from '@/components/modules/home/WhyChooseUs';


const LandingPage = () => {
    return (
        <div>
            <Hero />
            <HowItWorks />
             <TravelTypes />
            <AIFeature />
             <WhyChooseUs />
            <Destinations />
            <Testimonials />
            <div >
                <Pricing />
            </div>

        </div>
    );
};

export default LandingPage;