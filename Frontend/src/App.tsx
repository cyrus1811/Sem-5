import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Header from './components/Home/Header'
import Footer from './components/Home/Footer'
import Home from './pages/Home'
import SolarSystem from './pages/Solar'
import Simulation from './pages/Simulation'
import { useEffect } from 'react'
import PlanetInfo from './components/Planet_Info'
import PlanetsList from './components/Planet_list'
import PlanetComparison from './components/Planet_Comparison'
import PlanetAnalysis from './components/Planet_Analysis'

function App() {

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-5');
          }
        });
      },
      { threshold: 0.1 }
    );

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);


  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <div className="absolute h-fit inset-0 z-0">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.7 + 0.3,
                }}
              />
            ))}
            <div className="relative z-10">
              <Header />
              <Home />
              <Footer />
            </div>
          </div>
        </>
      )
    },
    {
      path: "/solar",
      element: <SolarSystem />
    },
    {
      path: "/simulation",
      element: <Simulation />
    },
    {
      path: "/planets",
      element: <PlanetsList />
    },
    {
      path: "/compare",
      element: <PlanetComparison />
    },
    {
      path: "/planet/:planetName",
      element: <PlanetInfo />
    },
    {
      path:  "/analysis",
      element: <PlanetAnalysis />
    }
  ])
  return (
    <RouterProvider router={router} />
  )
}

export default App

