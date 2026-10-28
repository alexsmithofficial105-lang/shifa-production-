import React from 'react';
import { HeroSection } from '../components/home/HeroSection.tsx';
import { AboutSection } from '../components/home/AboutSection.tsx';
import { ServicesSection } from '../components/home/ServicesSection.tsx';
import { PortfolioSection } from '../components/home/PortfolioSection.tsx';
import { WhyChooseUs } from '../components/home/WhyChooseUs.tsx';
import { ProcessSection } from '../components/home/ProcessSection.tsx';
import { TestimonialsSection } from '../components/home/TestimonialsSection.tsx';
import { CtaSection } from '../components/home/CtaSection.tsx';

export const HomePage: React.FC = () => {
  return (
    <div className="animate-fadeIn">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <PortfolioSection />
      <WhyChooseUs />
      <ProcessSection />
      <TestimonialsSection />
      <CtaSection />
    </div>
  );
};
