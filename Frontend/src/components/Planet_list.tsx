import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { ChevronsUpDown, Trash2, X } from 'lucide-react';
import { Planet, PlanetFilters } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const PlanetsList: React.FC = () => {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<PlanetFilters>({});
  const [comparisonList, setComparisonList] = useState<string[]>([]);
  const navigate = useNavigate();

  // Fetch planets on component mount
  useEffect(() => {
    const fetchPlanets = async () => {
      try {
        const response = await fetch('/celestial_bodies.json');
        const data = await response.json();
        setPlanets(data.planets);
      } catch (error) {
        console.error('Failed to fetch planets:', error);
      }
    };

    fetchPlanets();
  }, []);

  // Comprehensive filtering function
  const filteredPlanets = useMemo(() => {
    return planets.filter(planet => {
      // Search term filter
      if (searchTerm && !planet.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Habitability range filter
      if (filters.habitabilityRange) {
        const [min, max] = filters.habitabilityRange;
        if (planet.habitabilityScore < min || planet.habitabilityScore > max) {
          return false;
        }
      }

      // Prominent elements filter
      if (filters.prominentElements && filters.prominentElements.length > 0) {
        const planetElements = planet.prominentElements.map(el => el.element);
        if (!filters.prominentElements.some(element => planetElements.includes(element))) {
          return false;
        }
      }

      // Surface temperature range filter
      if (filters.surfaceTemperatureRange) {
        const [minTemp, maxTemp] = filters.surfaceTemperatureRange;
        const avgTemp = planet.surfaceTemperature.average;

        if (avgTemp === undefined || avgTemp < minTemp || avgTemp > maxTemp) {
          return false;
        }
      }

      // Closest star proximity filter
      if (filters.closestStarProximity) {
        const [minProximity, maxProximity] = filters.closestStarProximity;
        const starProximity = planet.closestStar.proximity;

        if (starProximity < minProximity || starProximity > maxProximity) {
          return false;
        }
      }

      return true;
    });
  }, [planets, searchTerm, filters]);

  // Rest of the component remains the same as in the previous implementation...
  // (ElementCombobox, ActiveFilters, addToComparisonList, comparePlanets, PlanetCard methods)

  const addToComparisonList = (planetName: string) => {
    if (comparisonList.includes(planetName)) return;
    setComparisonList((prevlist) => [...prevlist, planetName]);
  };

  const comparePlanets = () => {
    let joinedList = comparisonList.join(",")
    navigate(`/planet/compare?planets=${joinedList}`)
  };
  const ElementCombobox = () => {
    const allElements = Array.from(new Set(
      planets.flatMap(planet =>
        planet.prominentElements.map(el => el.element)
      )
    ));

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between bg-gray-800/50 text-white border-gray-700 hover:bg-gray-700/50"
          >
            Select Elements
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-gray-900 border-gray-700">
          <Command className="bg-gray-900">
            <CommandInput
              placeholder="Search elements..."
              className="bg-gray-800 text-white border-gray-700"
            />
            <CommandList>
              <CommandEmpty>No elements found.</CommandEmpty>
              <CommandGroup>
                {allElements.map((element) => (
                  <CommandItem
                    key={element}
                    value={element}
                    className="hover:bg-gray-800"
                    onSelect={() => {
                      const currentElements = filters.prominentElements || [];
                      const newElements = currentElements.includes(element)
                        ? currentElements.filter(e => e !== element)
                        : [...currentElements, element];

                      setFilters(prev => ({
                        ...prev,
                        prominentElements: newElements
                      }));
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 h-4 w-4 border border-gray-600",
                        filters.prominentElements?.includes(element)
                          ? "bg-blue-600"
                          : "opacity-50"
                      )}
                    />
                    {element}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  const ActiveFilters = () => {
    const activeFilters: { label: string, value: string, onRemove: () => void }[] = [];

    if (filters.prominentElements?.length) {
      activeFilters.push({
        label: `Elements: ${filters.prominentElements.join(', ')}`,
        value: 'elements',
        onRemove: () => setFilters(prev => ({ ...prev, prominentElements: [] }))
      });
    }

    if (filters.habitabilityRange) {
      activeFilters.push({
        label: `Habitability: ${(filters.habitabilityRange[0] * 100).toFixed(0)}% - ${(filters.habitabilityRange[1] * 100).toFixed(0)}%`,
        value: 'habitability',
        onRemove: () => setFilters(prev => ({ ...prev, habitabilityRange: undefined }))
      });
    }

    if (filters.surfaceTemperatureRange) {
      activeFilters.push({
        label: `Surface Temp: ${filters.surfaceTemperatureRange[0]}°C - ${filters.surfaceTemperatureRange[1]}°C`,
        value: 'temperature',
        onRemove: () => setFilters(prev => ({ ...prev, surfaceTemperatureRange: undefined }))
      });
    }

    if (filters.closestStarProximity) {
      activeFilters.push({
        label: `Star Proximity: ${filters.closestStarProximity[0]} - ${filters.closestStarProximity[1]} light-years`,
        value: 'proximity',
        onRemove: () => setFilters(prev => ({ ...prev, closestStarProximity: undefined }))
      });
    }

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {activeFilters.map(filter => (
          <Badge
            key={filter.value}
            variant="outline"
            className="flex items-center gap-2 bg-gray-800/50 text-white border-gray-700"
          >
            {filter.label}
            <X
              className="h-4 w-4 cursor-pointer hover:text-red-500"
              onClick={filter.onRemove}
            />
          </Badge>
        ))}
      </div>
    );
  };


  const PlanetCard: React.FC<{ planet: Planet }> = ({ planet }) => (
    <Card className="relative h-max z-10 bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-gray-700 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"

      onClick={() => navigate(`/planet/${planet.name}`)}
    >
      <CardHeader>
        <CardTitle className="text-2xl text-white/90 truncate">{planet.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <img
          src={planet.thumbnail}
          alt={planet.name}
          className="w-48 h-48 object-cover rounded-full mb-4 border-4 border-gray-700 shadow-lg"
        />
        <p className="text-sm text-center mb-4 text-white/80 line-clamp-3">{planet.smallDescription}</p>
        <div className="flex flex-col items-center gap-2 text-sm">
          <span>Habitability: {(planet.habitabilityScore * 100).toFixed(0)}%</span>
          <span>Closest Star: {planet.closestStar.name}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          variant="outline"
          className="rounded-xl text-white border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
          onClick={(e) => {
            e.stopPropagation()
            console.log(comparisonList)
            addToComparisonList(planet.name);
          }}
        >
          Add to Compare
        </Button>
      </CardFooter>
    </Card>
  );

  // Render remains mostly the same, but update the grid to use filteredPlanets
  return (
    <div className="flex min-h-screen bg-black p-4 space-x-6">
      {/* Sidebar with filters remains the same */}

      <div className="w-1/4 bg-gray-900/60 backdrop-blur-lg rounded-2xl p-6 space-y-6 max-h-[calc(100vh-2rem)] overflow-y-auto border border-gray-700 shadow-xl">
        <h2 className="text-3xl text-white font-bold mb-6 tracking-wide">Planet Explorer</h2>

        {/* Search */}
        <Input
          placeholder="Search planets..."
          className="mb-6 bg-gray-800/50 text-white border-gray-700 placeholder-white/50 rounded-xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Active Filters */}
        <ActiveFilters />

        {/* Filters */}
        <div className="space-y-6">
          {/* Habitability Filter */}
          <div>
            <h3 className="text-white mb-2 text-lg">Habitability</h3>
            <Slider
              defaultValue={[0, 1]}
              max={1}
              step={0.1}
              onValueChange={(value) => setFilters(prev => ({
                ...prev,
                habitabilityRange: value as [number, number]
              }))}
              className="w-full"
            />
          </div>

          {/* Prominent Elements Filter */}
          <div>
            <h3 className="text-white mb-2 text-lg">Elements</h3>
            <ElementCombobox />
          </div>

          {/* Surface Temperature Filter */}
          <div>
            <h3 className="text-white mb-2 text-lg">Surface Temperature (°C)</h3>
            <Slider
              defaultValue={[-200, 200]}
              min={-200}
              max={200}
              step={10}
              onValueChange={(value) => setFilters(prev => ({
                ...prev,
                surfaceTemperatureRange: value as [number, number]
              }))}
              className="w-full"
            />
          </div>

          {/* Closest Star Proximity Filter */}
          <div>
            <h3 className="text-white mb-2 text-lg">Star Proximity (light-years)</h3>
            <Slider
              defaultValue={[0, 100]}
              max={100}
              step={1}
              onValueChange={(value) => setFilters(prev => ({
                ...prev,
                closestStarProximity: value as [number, number]
              }))}
              className="w-full"
            />
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full justify-between bg-gray-800/50 text-white rounded-xl border-gray-700 hover:bg-gray-700/50"
          onClick={comparePlanets}
        >Compare</Button>

        {comparisonList.map((planet) => (
          <div className="flex justify-between gap-2">
            <p className="text-white/80 text-sm">{planet}</p>
            <Button
              variant="outline"
              className=""
              onClick={(e) => {
                e.stopPropagation()
                console.log(comparisonList)
                return setComparisonList((prevlist) => prevlist.filter((planetFilter) => planetFilter !== planet));
              }}>
              <Trash2 className="" />
            </Button>
          </div>
        ))}
      </div>

      {/* Planet Grid */}
      <div className="w-3/4 grid grid-cols-3 gap-6 overflow-y-auto pr-2">
        {filteredPlanets.map(planet => (
          <PlanetCard key={planet.name} planet={planet} />
        ))}
        {filteredPlanets.length === 0 && (
          <div className="col-span-3 text-center text-white/50 text-2xl">
            No planets match your filters
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanetsList;
