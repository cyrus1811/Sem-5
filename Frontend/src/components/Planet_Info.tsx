import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Planet } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

//interface PlanetInfoProps {
//  planets: Planet[];
//}

const PlanetInfo: React.FC = () => {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { planetName } = useParams<{ planetName: string }>();

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

  const planet = planets.find(p => p.name === planetName);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="text-white">Loading planet details...</div>
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

  if (!planet) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        Planet not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-purple-900 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center space-x-8">
          <img
            src={planet.gltfModel}
            alt={planet.name}
            className="w-64 h-64 object-cover rounded-full"
          />
          <div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
              {planet.name}
            </h1>
            <p className="text-xl text-gray-300">{planet.largeDescription}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle>Physical Characteristics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>Radius: {planet.radius} km</p>
                <p>Mass: {planet.mass} kg</p>
                <p>Volume: {planet.volume} km³</p>
                <p>Circumference: {planet.circumference} km</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle>Orbital Characteristics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>Orbital Speed: {planet.orbitalSpeed} km/s</p>
                <p>Time to Orbit: {planet.timeToOrbit} Earth days</p>
                <p>Closest Star: {planet.closestStar.name}</p>
                <p>Distance: {planet.closestStar.proximity} million km</p>
              </div>
            </CardContent>
          </Card>

          {/* More detailed cards for temperature, elements, etc. */}
        </div>
      </div>
    </div>
  );
};

export default PlanetInfo;
