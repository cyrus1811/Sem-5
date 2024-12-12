import React, { useState, useMemo, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Planet } from '@/lib/types';
import { useNavigate } from 'react-router-dom';

const PlanetsList: React.FC = () => {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minRadius: 0,
    maxRadius: Math.max(...planets.map(p => p.radius)),
    minMass: 0,
    maxMass: Math.max(...planets.map(p => p.mass)),
    minVolume: 0,
    maxVolume: Math.max(...planets.map(p => p.volume)),
    minEscapeVelocity: 0,
    maxEscapeVelocity: Math.max(...planets.map(p => p.escapeVelocity)),
    prominentElements: [] as string[]
  });

  const [comparisonList, setComparisonList] = useState<string[]>([]);

  const filteredPlanets = useMemo(() => {
    return planets.filter(planet =>
      planet.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      planet.radius >= filters.minRadius &&
      planet.radius <= filters.maxRadius &&
      planet.mass >= filters.minMass &&
      planet.mass <= filters.maxMass &&
      planet.volume >= filters.minVolume &&
      planet.volume <= filters.maxVolume &&
      planet.escapeVelocity >= filters.minEscapeVelocity &&
      planet.escapeVelocity <= filters.maxEscapeVelocity &&
      (filters.prominentElements.length === 0 ||
        planet.prominentElements.some(el =>
          filters.prominentElements.includes(el.element)
        ))
    );
  }, [planets, searchTerm, filters]);

  useEffect(() => {
    const fetchPlanets = async () => {
      try {
        const response = await fetch('/celestial_bodies.json');
        if (!response.ok) {
          throw new Error('Failed to fetch planets');
        }
        const data = await response.json();
        setPlanets(data.planets);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    };

    fetchPlanets();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="text-white">Loading planets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-red-500">
        {error}
      </div>
    );
  }

  const addToComparison = (planetName: string) => {
    setComparisonList(prev =>
      prev.includes(planetName)
        ? prev.filter(p => p !== planetName)
        : [...prev, planetName]
    );
  };

  const navigateToCompare = () => {
    navigate(`/compare?planets=${comparisonList.join(',')}`);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 relative overflow-hidden">
      {/* Meteor Shower Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/50 w-[2px] h-[100px] opacity-50 animate-meteor"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Planetary Explorer
        </h1>

        {/* Search and Filters */}
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 space-y-4">
            <Input
              placeholder="Search Planets"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/20 text-white border-white/20"
            />

            {/* Filter Sliders */}
            <div className="space-y-4">
              <div>
                <label>Radius: {filters.minRadius} - {filters.maxRadius}</label>
                <Slider
                  defaultValue={[0, Math.max(...planets.map(p => p.radius))]}
                  max={Math.max(...planets.map(p => p.radius))}
                  step={1}
                  onValueChange={(val) => setFilters(prev => ({ ...prev, minRadius: val[0], maxRadius: val[1] }))}
                />
              </div>
              {/* Similar sliders for mass, volume, escape velocity */}
            </div>
          </div>

          {/* Planets Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlanets.map(planet => (
              <Card
                key={planet.name}
                className="bg-white/10 backdrop-blur-lg border-white/20 hover:scale-105 transition-transform"
                onClick={() => navigate(`/info/${planet.name}`)}
              >
                <CardContent className="p-6 flex flex-col items-center">
                  <img
                    src={planet.thumbnail}
                    alt={planet.name}
                    className="w-32 h-32 object-cover rounded-full mb-4"
                  />
                  <h2 className="text-2xl font-bold mb-2">{planet.name}</h2>
                  <p className="text-center text-sm text-gray-300 mb-4">
                    {planet.smallDescription}
                  </p>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToComparison(planet.name);
                    }}
                    className={`w-full ${comparisonList.includes(planet.name)
                      ? 'bg-green-600'
                      : 'bg-blue-600'
                      }`}
                  >
                    {comparisonList.includes(planet.name)
                      ? 'Remove from Compare'
                      : 'Add to Compare'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Comparison Button */}
        {comparisonList.length > 0 && (
          <Button
            onClick={navigateToCompare}
            className="fixed bottom-8 right-8 bg-purple-600 hover:bg-purple-700"
          >
            Compare {comparisonList.length} Planet{comparisonList.length > 1 ? 's' : ''}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PlanetsList;
