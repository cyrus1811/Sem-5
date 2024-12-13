import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ChevronsUpDown, X, Star, Orbit, Info } from 'lucide-react';
import { Planet, ProminentElement } from '@/lib/types';
import { cn } from '@/lib/utils';

const PlanetComparison: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [comparePlanets, setComparePlanets] = useState<Planet[]>([]);
  const [availablePlanets, setAvailablePlanets] = useState<Planet[]>([]);

  // Extract planet names from URL
  useEffect(() => {
    const fetchPlanets = async () => {
      try {
        const response = await fetch('/celestial_bodies.json');
        const data = await response.json();
        const allPlanets = data.planets;
        setAvailablePlanets(allPlanets);

        // Extract planet names from URL query parameter
        const searchParams = new URLSearchParams(location.search);
        const planetNames = searchParams.get('planets')?.split(',') || [];

        // Filter planets based on URL parameters
        const planetsToCompare = allPlanets.filter(planet =>
          planetNames.includes(planet.name)
        );

        setComparePlanets(planetsToCompare);
      } catch (error) {
        console.error('Failed to fetch planets:', error);
      }
    };

    fetchPlanets();
  }, [location.search]);

  // Add planet to comparison
  const addPlanetToComparison = (planetName: string) => {
    const planetToAdd = availablePlanets.find(p => p.name === planetName);
    if (planetToAdd && comparePlanets.length < 4 && !comparePlanets.some(p => p.name === planetName)) {
      const updatedPlanets = [...comparePlanets, planetToAdd];
      setComparePlanets(updatedPlanets);

      // Update URL
      const planetNames = updatedPlanets.map(p => p.name).join(',');
      navigate(`/compare?planets=${planetNames}`);
    }
  };

  // Remove planet from comparison
  const removePlanet = (planetName: string) => {
    const updatedPlanets = comparePlanets.filter(p => p.name !== planetName);
    setComparePlanets(updatedPlanets);

    // Update URL
    const planetNames = updatedPlanets.map(p => p.name).join(',');
    navigate(`/compare?planets=${planetNames}`);
  };

  // Planet Selection Combobox
  const PlanetSelector = () => {
    const availablePlanetNames = availablePlanets
      .filter(p => !comparePlanets.some(cp => cp.name === p.name))
      .map(p => p.name);

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full bg-gradient-to-r from-gray-900 to-black text-white border-white/10 hover:from-gray-800 hover:to-gray-900 transition-all duration-300"
          >
            Add Planet to Comparison
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-gradient-to-br from-gray-900 to-black border-white/10">
          <Command className="bg-transparent">
            <CommandInput
              placeholder="Search celestial bodies..."
              className="bg-gray-800/50 text-white border-white/10 placeholder-white/50"
            />
            <CommandList>
              <CommandEmpty>No planets found.</CommandEmpty>
              <CommandGroup>
                {availablePlanetNames.map((planetName) => (
                  <CommandItem
                    key={planetName}
                    value={planetName}
                    onSelect={() => addPlanetToComparison(planetName)}
                    className="hover:bg-gray-800/50 text-white hover:text-white/80 transition-colors"
                  >
                    {planetName}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  // Comparative properties to display

  const comparisonProperties = [
    {
      key: 'thumbnail',
      label: 'Planet Visualization',
      transform: (thumbnail: string, planet: Planet) => (
        <div className="flex flex-col items-center">
          <img
            src={thumbnail}
            alt={planet.name}
            className="w-32 h-32 object-cover rounded-full border-4 border-white/20 shadow-2xl hover:scale-110 transition-transform duration-300"
          />
          <span className="mt-2 text-sm text-white/70">{planet.name}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/planet/${planet.name}`)}
            className="mt-2 text-white hover:text-blue-400"
            title="View Planet Details"
          >
            <Info className="h-5 w-5" />
          </Button>
        </div>
      ),
    },
    {
      key: 'radius',
      label: 'Radius',
      icon: <Orbit className="inline-block mr-2 text-white/70" />,
      transform: (val: number) => (typeof val === 'number' ? `${val.toLocaleString()} km` : 'N/A'),
    },
    {
      key: 'closestStar.name',
      label: 'Closest Star',
      icon: <Star className="inline-block mr-2 text-yellow-400" />,
      transform: (val: string, planet: Planet) =>
        typeof val === 'string' && planet.closestStar?.proximity

          ? `${val} ${typeof planet.closestStar.proximity === 'number' ? planet.closestStar.proximity.toFixed(2) : 'N/A'}` : 'N/A',
    },
    {
      key: 'habitabilityScore',
      label: 'Habitability',
      transform: (val: any) => {
        const score = typeof val === 'number' ? (val * 100).toFixed(0) : 'N/A';
        return `${score}%`;
      },
      colorGradient: (val: any) => {
        const score = typeof val === 'number' ? val * 100 : 0;
        return score > 70 ? 'text-green-400' : score > 40 ? 'text-yellow-400' : 'text-red-400';
      },
    },
    {
      key: 'surfaceTemperature.average',
      label: 'Avg. Surface Temp',
      transform: (val?: any) =>
        typeof val === 'number' ? `${val.toFixed(1)}°C` : 'N/A',
      colorGradient: (val?: any) => {
        if (typeof val !== 'number') return 'text-gray-400';
        return val > 50 ? 'text-red-400' : val < 0 ? 'text-blue-400' : 'text-green-400';
      },
    },
    {
      key: 'surfacePressure',
      label: 'Surface Pressure',
      transform: (val: number) =>
        typeof val === 'number' ? `${val.toFixed(2)} atm` : 'N/A',
    },
    {
      key: 'orbitalSpeed',
      label: 'Orbital Speed',
      transform: (val: any) =>
        typeof val === 'number' ? `${val.toFixed(2)} km/s` : 'N/A',
    },
    {
      key: 'mass',
      label: 'Mass',
      transform: (val: any) =>
        typeof val === 'number' ? `${(val / 1e24).toFixed(2)} × 10²⁴ kg` : 'N/A',
    },
    {
      key: 'prominentElements',
      label: 'Prominent Elements',
      transform: (val: any) => {
        if (!Array.isArray(val)) return 'N/A';
        return val
          .map(
            (el) =>
              `${el.element || 'Unknown'} (${typeof el.percentage === 'number' ? el.percentage.toFixed(1) : 'N/A'
              }%)`
          )
          .join(', ');
      },
    },
    {
      key: 'timeToOrbit',
      label: 'Orbital Period',
      transform: (val: number) =>
        typeof val === 'number' ? `${val.toFixed(2)} Earth years` : 'N/A',
    },
    {
      key: 'escapeVelocity',
      label: 'Escape Velocity',
      transform: (val: number) =>
        typeof val === 'number' ? `${val.toFixed(2)} km/s` : 'N/A',
    },
  ];

  // Helper function to get nested property
  const getNestedProperty = (obj: any, path: string) => {
    return path.split('.').reduce((o, key) => o && o[key], obj);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black relative overflow-hidden">
      <div className="relative z-10 p-8 space-y-6">
        <Card className="bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row justify-between items-center border-b border-white/10 pb-4 bg-black/20 backdrop-blur-xl">
            <CardTitle className="text-4xl text-white tracking-wide font-bold">
              <Button
                variant="ghost"
                className="m-2 rounded-full bg-black/20 backdrop-blur-xl"
                onClick={() => window.location.href = '/'}
              >
                &lt;
              </Button>
              Celestial Body Comparison
            </CardTitle>
            <div className="flex items-center space-x-4">
              <PlanetSelector />
            </div>
          </CardHeader>
          <CardContent className="mt-4">
            {comparePlanets.length === 0 ? (
              <div className="text-center text-white/50 text-2xl py-12 bg-black/20 backdrop-blur-xl rounded-xl">
                Select planets to begin your cosmic comparison
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-black/30 backdrop-blur-xl">
                    <TableRow>
                      <TableHead className="w-[250px] text-white">Characteristics</TableHead>
                      {comparePlanets.map(planet => (
                        <TableHead key={planet.name} className="text-center text-white">
                          <div className="flex justify-center items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removePlanet(planet.name)}
                              className="text-white hover:text-red-500 absolute right-2"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comparisonProperties.map(prop => (
                      <TableRow
                        key={prop.key}
                        className="hover:bg-white/5 transition-colors duration-200"
                      >
                        <TableCell className="font-medium text-white flex items-center">
                          {prop.icon}
                          {prop.label}
                        </TableCell>
                        {comparePlanets.map(planet => {
                          const value = getNestedProperty(planet, prop.key);
                          const displayValue = prop.transform
                            ? prop.transform(value, planet)
                            : value?.toString() || 'N/A';

                          return (
                            <TableCell
                              key={planet.name}
                              className={cn(
                                "text-center text-white/80 transition-all duration-300",
                                prop.colorGradient && prop.colorGradient(value)
                              )}
                            >
                              {displayValue}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlanetComparison;
