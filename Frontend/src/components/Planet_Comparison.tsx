import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Planet } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const ComparisonPage: React.FC = () => {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const [additionalPlanets, setAdditionalPlanets] = useState<string[]>([]);

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

  const comparisonPlanetNames = searchParams
    .get('planets')
    ?.split(',')
    .filter(Boolean) || [];

  const comparisonPlanets = [
    ...planets.filter(p => comparisonPlanetNames.includes(p.name)),
    ...planets.filter(p => additionalPlanets.includes(p.name))
  ];

  const availablePlanets = planets
    .filter(p => !comparisonPlanets.map(cp => cp.name).includes(p.name));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="text-white">Loading comparison data...</div>
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
  const addPlanet = (planetName: string) => {
    setAdditionalPlanets(prev => [...prev, planetName]);
  };

  const removePlanet = (planetName: string) => {
    setAdditionalPlanets(prev => prev.filter(p => p !== planetName));
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
        Planetary Comparison
      </h1>

      <div className="flex mb-4 space-x-4">
        <Select onValueChange={addPlanet}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Add Planet" />
          </SelectTrigger>
          <SelectContent>
            {availablePlanets.map(planet => (
              <SelectItem key={planet.name} value={planet.name}>
                {planet.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Characteristic</TableHead>
              {comparisonPlanets.map(planet => (
                <TableHead key={planet.name} className="min-w-[200px]">
                  <div className="flex items-center justify-between">
                    {planet.name}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (comparisonPlanetNames.includes(planet.name)) {
                          alert('Cannot remove initial comparison planets');
                          return;
                        }
                        removePlanet(planet.name);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Render various characteristics */}
            <TableRow>
              <TableCell>Radius (km)</TableCell>
              {comparisonPlanets.map(planet => (
                <TableCell key={planet.name}>{planet.radius}</TableCell>
              ))}
            </TableRow>
            {/* Add more rows for mass, volume, etc. */}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ComparisonPage;
