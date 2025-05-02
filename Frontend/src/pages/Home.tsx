import { lazy, Suspense } from 'react';

// Only import Hero normally as it likely contains LCP elements
import Hero from '../components/Home/Hero';

// Lazy load all other components
const About = lazy(() => import('../components/Home/About'));
const Discover = lazy(() => import('../components/Home/Discover'));
const Research = lazy(() => import('../components/Home/Research'));
const Contact = lazy(() => import('../components/Home/Contact'));

// Simple loading placeholder
const LoadingFallback = () => <div className="min-h-[200px] flex items-center justify-center">Loading...</div>;

export default function Home() {
  return (
    <main>
      {/* Render Hero immediately - it contains LCP elements */}
      <Hero />
      
      {/* Lazy load remaining sections */}
      <Suspense fallback={<LoadingFallback />}>
        <About />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <Discover />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <Research />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <Contact />
      </Suspense>
    </main>
  );
}