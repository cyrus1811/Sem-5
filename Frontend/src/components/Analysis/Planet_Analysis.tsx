import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle, ThermometerSun, FlaskConical, Globe, Shuffle, Sun, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Papa from 'papaparse';
import axios from 'axios';
import Gemini_Response from './Gemini_Response';
import Habitability_Analysis from './Habitability_Analysis';
import { PlanetData, PlanetCatalog } from '@/types/types';


const PlanetAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planetData, setPlanetData] = useState<PlanetData | null>(null);
  const [planetCatalog, setPlanetCatalog] = useState<PlanetCatalog[]>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<PlanetCatalog[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Planet parameters
    pl_mass: '',
    pl_radius: '',
    pl_density: '',
    pl_orb_period: '',
    pl_ecc: '',
    pl_surf_temp: '',
    pl_surf_temp_min: '',
    pl_ecc_limit: '',
    pl_flux: '',
    // Stellar parameters
    stellar_temp: '',
    stellar_metal: '',
    stellar_log_lum: '',
    stellar_age: '',
    stellar_dist: '',
    stellar_dist_error_min: '',
    stellar_abio_zone: '',
    stellar_dist_error_max: ''
  });

  const radiationColors = {
    Low: 'bg-green-500',
    Medium: 'bg-yellow-500',
    High: 'bg-red-500',
  };

  // Planet type descriptions
  const planetDescriptions = {
    "Jovian": "A gas giant primarily composed of hydrogen and helium, similar to Jupiter or Saturn.",
    "Miniterran": "A small terrestrial planet with a solid surface, significantly smaller than Earth.",
    "Neptunian": "A gas or ice giant with a composition and size similar to Neptune or Uranus.",
    "Subterran": "A rocky planet smaller than Earth, with lower gravity and thinner atmosphere.",
    "Superterran": "A massive rocky planet larger than Earth but smaller than gas giants.",
    "Terran": "A terrestrial planet with Earth-like conditions, potentially habitable."
  };

  useEffect(() => {
    fetch("/data/PHL_HWC.csv")
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setPlanetCatalog(result.data as PlanetCatalog[]);
          },
        });
      })
      .catch((error) => console.error("Error loading CSV:", error));
  }, []);

  // Handle search input changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filteredPlanets = planetCatalog
      .filter(planet =>
        planet.P_NAME.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 10); // Limit to first 10 results for performance

    setSearchResults(filteredPlanets);
  }, [searchTerm, planetCatalog]);

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowResults(true);
  };

  const handleSearchFocus = () => {
    setShowResults(true);
  };

  const handleSearchBlur = () => {
    // Increased delay to 300ms to ensure click event fires
    setTimeout(() => {
      if (!document.activeElement?.closest('.search-results')) {
        setShowResults(false);
      }
    }, 300);
  };

  const handlePlanetSelect = (planet: PlanetCatalog) => {
    console.log("Clicked");
    setSelectedPlanet(planet.P_NAME);
    setSearchTerm(planet.P_NAME);
    setShowResults(false);

    setFormData({
      pl_mass: planet.P_MASS.toString(),
      pl_radius: planet.P_RADIUS.toString(),
      pl_density: planet.P_DENSITY.toString(),
      pl_orb_period: planet.P_PERIOD.toString() || (Math.random() * 365 + 1).toFixed(2),
      pl_ecc: planet.P_ECCENTRICITY.toString() || Math.random().toFixed(2),
      pl_surf_temp: planet.P_TEMP_SURF.toString() || (Math.random() * 1000 + 273).toFixed(2),
      pl_surf_temp_min: planet.P_TEMP_SURF_MIN.toString() || (Math.random() * 1000 + 273).toFixed(2),
      pl_ecc_limit: planet.P_ECCENTRICITY_LIMIT.toString() || Math.random().toFixed(2),
      pl_flux: planet.P_FLUX.toString() || (Math.random() * 9 + 1).toFixed(2),
      stellar_temp: planet.S_TEMPERATURE.toString() || (Math.random() * 10000 + 2500).toFixed(2),
      stellar_metal: planet.S_METALLICITY.toString() || (Math.random() * 1.5 - 0.5).toFixed(2),
      stellar_log_lum: planet.S_LOG_LUM.toString() || (Math.random() * 6 - 3).toFixed(2),
      stellar_age: planet.S_AGE.toString() || (Math.random() * 10 + 1).toFixed(2),
      stellar_dist: planet.S_DISTANCE.toString() || (Math.random() * 500 + 1).toFixed(2),
      stellar_dist_error_min: planet.S_DISTANCE_ERROR_MIN.toString() || (Math.random() * 50 + 1).toFixed(2),
      stellar_abio_zone: planet.S_ABIO_ZONE.toString() || (Math.random() * 9 + 0.1).toFixed(2),
      stellar_dist_error_max: planet.S_DISTANCE_ERROR_MAX.toString() || (Math.random() * 50 + 1).toFixed(2),
    });
  };

  const handleRandomPlanet = () => {
    const pl_mass = (Math.random() * 10 + 0.1).toFixed(2); // 0.1 - 10 Earth masses
    const pl_radius = (Math.random() * 5 + 0.5).toFixed(2); // 0.5 - 5 Earth radii

    const pl_density = (
      parseFloat(pl_mass) /
      ((4 / 3) * Math.PI * Math.pow(parseFloat(pl_radius), 3) || 1)
    ).toFixed(6);

    setFormData({
      pl_mass,
      pl_radius,
      pl_density,
      pl_orb_period: (Math.random() * 365 + 1).toFixed(2), // 1 - 365 days
      pl_ecc: Math.random().toFixed(2), // 0.00 - 1.00

      pl_surf_temp: (Math.random() * 1000 + 200).toFixed(2), // 200K - 1200K
      pl_surf_temp_min: (Math.random() * 800 + 150).toFixed(2), // 150K - 950K
      pl_ecc_limit: Math.random().toFixed(2), // 0.00 - 1.00
      pl_flux: (Math.random() * 9 + 1).toFixed(2), // 1 - 10 (Earth flux units)

      stellar_temp: (Math.random() * 10000 + 2500).toFixed(2), // 2500K - 12500K
      stellar_metal: (Math.random() * 1.5 - 0.5).toFixed(2), // -0.5 to 1.0
      stellar_log_lum: (Math.random() * 6 - 3).toFixed(2), // -3 to +3 (log scale)
      stellar_age: (Math.random() * 10 + 1).toFixed(2), // 1 - 11 Gyr
      stellar_dist: (Math.random() * 500 + 1).toFixed(2), // 1 - 500 ly
      stellar_dist_error_min: (Math.random() * 50 + 1).toFixed(2), // 1 - 50 ly error
      stellar_dist_error_max: (Math.random() * 50 + 1).toFixed(2), // 1 - 50 ly error
      stellar_abio_zone: (Math.random() * 9 + 0.1).toFixed(2), // 0.1 - 9 AU
    });

    setSelectedPlanet("");
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const planet_response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/predict-planet-type`, {
        pl_mass: parseFloat(formData.pl_mass),
        pl_radius: parseFloat(formData.pl_radius),
      });

      const radiation_response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/predict-radiation`, {
        stellar_temp: parseFloat(formData.stellar_temp),
        stellar_metal: parseFloat(formData.stellar_metal),
        stellar_log_lum: parseFloat(formData.stellar_log_lum),
        stellar_age: parseFloat(formData.stellar_age),
        stellar_dist: parseFloat(formData.stellar_dist),
        pl_radius: parseFloat(formData.pl_radius),
        pl_mass: parseFloat(formData.pl_mass),
      });

      const gas_response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/predict-gas`, {
        spectrum: Array.from({ length: 100 }, () => Math.random() * 0.01),
        planetary_features: [
          formData.pl_mass,
          formData.pl_radius,
          formData.pl_density,
          formData.pl_orb_period,
          formData.stellar_temp,
          formData.pl_ecc,
          formData.stellar_age
        ],
      });

      // Replace the part where you set the planetData after API calls:
      console.log("Planet response:", planet_response.data);
      console.log("Radiation response:", radiation_response.data);
      console.log("Gas response:", gas_response.data);
      console.log("Gas composition structure:", JSON.stringify(gas_response.data.predicted_gases));

      const response_data = {
        planetType: planet_response.data,
        radiationLevel: radiation_response.data,
        gasComposition: gas_response.data.predicted_gases,
      };

      console.log("Final data structure:", JSON.stringify(response_data));
      setPlanetData(response_data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-[#0e0e15]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white to-blue-500 bg-clip-text text-transparent">
            Exoplanet Analysis
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mt-6">
            Submit planetary coordinates and conditions to analyze exoplanet habitability and composition.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Analysis Form */}
          <Card className="bg-[rgba(14,14,21,0.8)] border-gray-800 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Planetary System Parameters</CardTitle>
              <CardDescription className="text-gray-400">
                Search for a known planet or enter custom parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Planet Search Input */}
                <div className="space-y-2">
                  <Label htmlFor="planet-search" className="text-white">
                    Search Exoplanet
                  </Label>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="relative">
                      <Input
                        id="planet-search"
                        type="text"
                        placeholder="Search planets..."
                        className="w-full bg-white/10 border-white/20 text-white"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onFocus={handleSearchFocus}
                        onBlur={handleSearchBlur}
                      />
                      {showResults && searchResults.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-[#1a1a27] border border-gray-800 rounded-md shadow-lg max-h-60 overflow-auto search-results">
                          <ul>
                            {searchResults.map((planet) => (
                              <li
                                key={planet.P_NAME}
                                className="px-4 py-2 hover:bg-white/10 cursor-pointer text-white"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handlePlanetSelect(planet);
                                }}
                              >
                                {planet.P_NAME}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                      onClick={handleRandomPlanet}
                    >
                      <Shuffle className="mr-2 h-4 w-4" />
                      Random Parameters
                    </Button>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-800">
                  <p className="text-sm text-gray-400 mb-4">
                    {selectedPlanet
                      ? `Showing parameters for ${selectedPlanet}`
                      : "Custom planetary parameters"}
                  </p>
                </div>

                {/* Planet Parameters Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-medium text-blue-400">Planet Parameters</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pl_mass" className="text-white">Mass (Earth = 1)</Label>
                      <Input
                        id="pl_mass"
                        type="number"
                        placeholder="e.g., 1.2"
                        className="bg-white/10 border-white/20 text-white"
                        value={formData.pl_mass}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pl_radius" className="text-white">Radius (Earth = 1)</Label>
                      <Input
                        id="pl_radius"
                        type="number"
                        placeholder="e.g., 1.5"
                        className="bg-white/10 border-white/20 text-white"
                        value={formData.pl_radius}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pl_density" className="text-white">Density (g/cm³)</Label>
                      <Input
                        id="pl_density"
                        type="number"
                        placeholder="e.g., 5.51"
                        className="bg-white/10 border-white/20 text-white"
                        value={formData.pl_density}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pl_orb_period" className="text-white">Orbital Period (days)</Label>
                      <Input
                        id="pl_orb_period"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 365.25"
                        className="bg-white/10 border-white/20 text-white"
                        value={formData.pl_orb_period}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pl_ecc" className="text-white">Orbital Eccentricity</Label>
                      <Input
                        id="pl_ecc"
                        type="number"
                        step="0.01"
                        max="1"
                        placeholder="e.g., 0.02"
                        className="bg-white/10 border-white/20 text-white"
                        value={formData.pl_ecc}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pl_surf_temp" className="text-white">Planet Surface Temperature</Label>
                      <Input
                        id="pl_surf_temp"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 0.02"
                        className="bg-white/10 border-white/20 text-white"
                        value={formData.pl_surf_temp}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pl_surf_temp_min" className="text-white">Planet Surface Temp (Min)</Label>
                      <Input
                        id="pl_surf_temp_min"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 0.02"
                        className="bg-white/10 border-white/20 text-white"
                        value={formData.pl_surf_temp_min}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pl_ecc_limit" className="text-white">Planet Eccentricity Limit</Label>
                      <Input
                        id="pl_ecc_limit"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 0.02"
                        className="bg-white/10 border-white/20 text-white"
                        value={formData.pl_ecc_limit}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pl_flux" className="text-white">Planet Flux</Label>
                      <Input
                        id="pl_flux"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 0.02"
                        className="bg-white/10 border-white/20 text-white"
                        value={formData.pl_flux}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Star Parameters Section */}
                <div className="space-y-4 pt-2 border-t border-gray-800">
                  <div className="flex items-center space-x-2">
                    <Sun className="h-5 w-5 text-yellow-400" />
                    <h3 className="text-lg font-medium text-yellow-400">Star Parameters</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stellar_temp" className="text-white">Temperature (K)</Label>
                      <Input
                        id="stellar_temp"
                        type="number"
                        step="1"
                        placeholder="e.g., 5778"
                        className="bg-white/10 border-white/20 text-white"
                        value={formData.stellar_temp}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stellar_dist" className="text-white">Distance (light-years)</Label>
                      <Input
                        id="stellar_dist"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 4.3"
                        className="bg-white/10 border-white/20 text-white"
                        value={formData.stellar_dist}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stellar_metal" className="text-white">Metallicity [Fe/H]</Label>
                      <Input
                        id="stellar_metal"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 0.0"
                        className="bg-white/10 border-white/20 text-white"
                        value={formData.stellar_metal}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stellar_log_lum" className="text-white">Log Luminosity (L☉)</Label>
                      <Input
                        id="stellar_log_lum"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 0.0"
                        className="bg-white/10 border-white/20 text-white"
                        value={formData.stellar_log_lum}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stellar_age" className="text-white">Age (billion years)</Label>
                      <Input
                        id="stellar_age"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 4.6"
                        className="bg-white/10 border-white/20 text-white"
                        value={formData.stellar_age}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stellar_dist_error_min" className="text-white">Stellar Distance Error (Min)</Label>
                      <Input
                        id="stellar_dist_error_min"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 4.6"
                        className="bg-white/10 border-white/20 text-white"
                        value={formData.stellar_dist_error_min}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stellar_dist_error_max" className="text-white">Stellar Distance Error (Max)</Label>
                      <Input
                        id="stellar_dist_error_max"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 4.6"
                        className="bg-white/10 border-white/20 text-white"
                        value={formData.stellar_dist_error_max}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stellar_abio_zone" className="text-white">Stellar Abio Zone</Label>
                      <Input
                        id="stellar_abio_zone"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 4.6"
                        className="bg-white/10 border-white/20 text-white"
                        value={formData.stellar_abio_zone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full py-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : 'Analyze Planet Data'}
                </Button>


                <Habitability_Analysis
                  formData={formData}
                  selectedPlanet={selectedPlanet}
                />

              </form>

              {error && (
                <Alert variant="destructive" className="mt-4 bg-red-900/20 border-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {planetData && (
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                    <h3 className="text-lg font-medium text-purple-400">AI Analysis</h3>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl">
                    <Gemini_Response planetData={planetData} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Display */}
          <div className="space-y-6">
            {planetData ? (
              <>
                {/* Planet Type Card */}
                <Card className="bg-[rgba(14,14,21,0.8)] border-gray-800 backdrop-blur-xl shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600/50 to-purple-600/50 h-2"></div>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Globe className="h-8 w-8 text-blue-400" />
                    <div>
                      <CardTitle className="text-white">Planet Classification</CardTitle>
                      <CardDescription className="text-gray-400">
                        {selectedPlanet
                          ? `Analysis of ${selectedPlanet}`
                          : 'Identified planet type based on submitted parameters'}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white/5 p-4 rounded-xl">
                      <h3 className="text-2xl font-bold text-blue-400 mb-2">
                        {planetData.planetType?.prediction || 'Unknown Planet Type'}
                      </h3>
                      <p className="text-gray-300">
                        {planetDescriptions[planetData.planetType?.prediction as keyof typeof planetDescriptions] ||
                          'A planet with unique characteristics.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Radiation Level Card */}
                <Card className="bg-[rgba(14,14,21,0.8)] border-gray-800 backdrop-blur-xl shadow-xl overflow-hidden">
                  <div className={`h-2 ${radiationColors[planetData.radiationLevel?.prediction as keyof typeof radiationColors]}`}></div>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <ThermometerSun className="h-8 w-8 text-yellow-400" />
                    <div>
                      <CardTitle className="text-white">Radiation Analysis</CardTitle>
                      <CardDescription className="text-gray-400">
                        Surface radiation level assessment
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center ${radiationColors[planetData.radiationLevel?.prediction as keyof typeof radiationColors]
                          }`}
                      >
                        <span className="text-white font-bold uppercase">
                          {planetData.radiationLevel?.prediction || 'Unknown'}
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-300">
                          {planetData.radiationLevel?.prediction === 'Low' &&
                            'Safe for long-term habitation with minimal protection.'}
                          {planetData.radiationLevel?.prediction === 'Medium' &&
                            'Moderate risk. Radiation shielding recommended for extended exposure.'}
                          {planetData.radiationLevel?.prediction === 'High' &&
                            'Dangerous levels. Specialized radiation shielding required for any surface activity.'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Gas Composition Card */}
                <Card className="bg-[rgba(14,14,21,0.8)] border-gray-800 backdrop-blur-xl shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-green-600/50 to-teal-600/50 h-2"></div>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <FlaskConical className="h-8 w-8 text-green-400" />
                    <div>
                      <CardTitle className="text-white">Atmospheric Composition</CardTitle>
                      <CardDescription className="text-gray-400">
                        Breakdown of atmospheric gases
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {planetData.gasComposition &&
                        Object.entries(planetData.gasComposition).map(([gas, value], index) => {
                          // Ensure the gas percentage is a number
                          const percentage = typeof value === 'number' ? value : value?.prediction || 0;
                          const displayPercentage = (percentage * 100).toFixed(2);

                          return (
                            <div key={index} className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-300">{gas}</span>
                                <span className="text-gray-400">{displayPercentage}%</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div
                                  className="bg-gradient-to-r from-blue-400 to-indigo-600 h-2.5 rounded-full"
                                  style={{ width: `${percentage * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-[rgba(14,14,21,0.8)] border-gray-800 backdrop-blur-xl shadow-xl h-full flex items-center justify-center">
                <CardContent className="text-center p-12">
                  <div className="bg-white/5 p-8 rounded-xl">
                    <Globe className="h-16 w-16 text-blue-400 mx-auto mb-6 opacity-50" />
                    <h3 className="text-xl font-semibold text-gray-300 mb-4">
                      No Planet Data Yet
                    </h3>
                    <p className="text-gray-400">
                      Search for a known planet, generate random parameters,
                      or submit custom values to receive a detailed analysis.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanetAnalysis;