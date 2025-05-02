// @ts-nocheck
import React, { useEffect, useState, useRef, memo, Suspense, lazy } from 'react';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

// Lazy load Three.js - only import it when component mounts
const PlanetAnimation = lazy(() => import('./PlanetAnimation'));

// Loading spinner extracted as a separate component
const LoadingSpinner = memo(() => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
));

// Content section extracted as a separate component for better re-rendering control
const HeroContent = memo(() => (
  <div className="p-8 rounded-3xl bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl transform translate-y-12 opacity-0 animate-fadeInUp">
    <h1 className="text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white via-blue-400 to-purple-500 bg-clip-text text-transparent">
      Discover New Worlds
    </h1>
    <p className="text-xl text-white/90 mb-8 leading-relaxed">
      Journey through the cosmos with our advanced AI technology, uncovering potentially habitable exoplanets and expanding our understanding of the universe.
    </p>
    <div className="flex gap-4">
      <Button
        variant='outline'
        href="#discover"
        className="group inline-flex items-center gap-3 px-8 py-6 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 cursor-pointer"
      >
        Begin Exploration
        <ArrowRight className='transform transition-transform group-hover:translate-x-1' />
      </Button>
      <Button
        variant="outline"
        className="px-8 py-6 rounded-xl font-bold border-white/20 text-white/90 hover:bg-white/10 transition-all duration-300"
      >
        Learn More
      </Button>
    </div>
  </div>
));

// Main Hero component
const Hero = () => {
  const [isThreeJSLoaded, setIsThreeJSLoaded] = useState(false);
  const [shouldLoadPlanet, setShouldLoadPlanet] = useState(false);
  
  // Defer loading the 3D animation
  useEffect(() => {
    // Check if we're above the fold and in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Only load Three.js after the page has finished loading critical content
          if (document.readyState === 'complete') {
            setShouldLoadPlanet(true);
          } else {
            window.addEventListener('load', () => setShouldLoadPlanet(true), { once: true });
          }
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    // Start observing the hero section
    const heroSection = document.querySelector('section');
    if (heroSection) observer.observe(heroSection);
    
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative flex items-center justify-center px-4 py-24">
      <div className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-blue-900/5 to-transparent"></div>

      <div className="relative max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <HeroContent />

        <div className="relative h-[600px] transform translate-x-12 opacity-0 animate-fadeInRight delay-300">
          {shouldLoadPlanet ? (
            <Suspense fallback={<LoadingSpinner />}>
              <PlanetAnimation onLoad={() => setIsThreeJSLoaded(true)} />
            </Suspense>
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </div>
    </section>
  );
};

export default memo(Hero);