import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { ChevronsUpDown, X } from 'lucide-react';
import { Planet, PlanetFilters } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const PlanetExplorer: React.FC = () => {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [filteredPlanets, setFilteredPlanets] = useState<Planet[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<PlanetFilters>({});
  const navigate = useNavigate();

  // Fetch planets on component mount
  useEffect(() => {
    const fetchPlanets = async () => {
      try {
        const response = await fetch('/celestial_bodies.json');
        const data = await response.json();
        setPlanets(data.planets);
        setFilteredPlanets(data.planets);
      } catch (error) {
        console.error('Failed to fetch planets:', error);
      }
    };

    fetchPlanets();
  }, []);

  // Filtering logic remains the same as in the previous implementation

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
    <Card className="bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-gray-700 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
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
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          className="text-white border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
          onClick={() => navigate(`/planet/${planet.name}/compare`)}
        >
          Compare
        </Button>
        <Button
          variant="secondary"
          className="text-white bg-blue-800/50 border-blue-700 hover:bg-blue-700/50"
          onClick={() => navigate(`/planet/${planet.name}`)}
        >
          Details
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="flex min-h-screen bg-black p-4 space-x-6">
      {/* Sidebar */}
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

export default PlanetExplorer;
