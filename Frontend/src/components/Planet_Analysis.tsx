import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle, ThermometerSun, FlaskConical, Globe, Shuffle, Sun } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Papa from 'papaparse';

interface PlanetData {
  planetType: string;
  radiationLevel: 'low' | 'medium' | 'high';
  gasComposition: {
    gas: string;
    percentage: number;
  }[];
}

interface PlanetCatalog {
  P_NAME: string
  P_DETECTION: string
  P_DISCOVERY_FACILITY: string
  P_YEAR: string
  P_UPDATE: string
  P_MASS: string
  P_MASS_ERROR_MIN: string
  P_MASS_ERROR_MAX: string
  P_MASS_LIMIT: string
  P_MASS_ORIGIN: string
  P_RADIUS: string
  P_RADIUS_ERROR_MIN: string
  P_RADIUS_ERROR_MAX: string
  P_RADIUS_LIMIT: string
  P_PERIOD: string
  P_PERIOD_ERROR_MIN: string
  P_PERIOD_ERROR_MAX: string
  P_PERIOD_LIMIT: string
  P_SEMI_MAJOR_AXIS: string
  P_SEMI_MAJOR_AXIS_ERROR_MIN: string
  P_SEMI_MAJOR_AXIS_ERROR_MAX: string
  P_SEMI_MAJOR_AXIS_LIMIT: string
  P_ECCENTRICITY: string
  P_ECCENTRICITY_ERROR_MIN: string
  P_ECCENTRICITY_ERROR_MAX: string
  P_ECCENTRICITY_LIMIT: string
  P_INCLINATION: string
  P_INCLINATION_ERROR_MIN: string
  P_INCLINATION_ERROR_MAX: string
  P_INCLINATION_LIMIT: string
  P_OMEGA: string
  P_OMEGA_ERROR_MIN: string
  P_OMEGA_ERROR_MAX: string
  P_OMEGA_LIMIT: string
  S_NAME: string
  S_NAME_HD: string
  S_NAME_HIP: string
  S_TYPE: string
  S_RA: string
  S_DEC: string
  S_RA_STR: string
  S_DEC_STR: string
  S_MAG: string
  S_MAG_ERROR_MIN: string
  S_MAG_ERROR_MAX: string
  S_DISTANCE: string
  S_DISTANCE_ERROR_MIN: string
  S_DISTANCE_ERROR_MAX: string
  S_TEMPERATURE: string
  S_TEMPERATURE_ERROR_MIN: string
  S_TEMPERATURE_ERROR_MAX: string
  S_TEMPERATURE_LIMIT: string
  S_MASS: string
  S_MASS_ERROR_MIN: string
  S_MASS_ERROR_MAX: string
  S_MASS_LIMIT: string
  S_RADIUS: string
  S_RADIUS_ERROR_MIN: string
  S_RADIUS_ERROR_MAX: string
  S_RADIUS_LIMIT: string
  S_METALLICITY: string
  S_METALLICITY_ERROR_MIN: string
  S_METALLICITY_ERROR_MAX: string
  S_METALLICITY_LIMIT: string
  S_AGE: string
  S_AGE_ERROR_MIN: string
  S_AGE_ERROR_MAX: string
  S_AGE_LIMIT: string
  S_LOG_LUM: string
  S_LOG_LUM_ERROR_MIN: string
  S_LOG_LUM_ERROR_MAX: string
  S_LOG_LUM_LIMIT: string
  S_LOG_G: string
  S_LOG_G_ERROR_MIN: string
  S_LOG_G_ERROR_MAX: string
  S_LOG_G_LIMIT: string
  P_ESCAPE: string
  P_POTENTIAL: string
  P_GRAVITY: string
  P_DENSITY: string
  P_HILL_SPHERE: string
  P_DISTANCE: string
  P_PERIASTRON: string
  P_APASTRON: string
  P_DISTANCE_EFF: string
  P_FLUX: string
  P_FLUX_MIN: string
  P_FLUX_MAX: string
  P_TEMP_EQUIL: string
  P_TEMP_EQUIL_MIN: string
  P_TEMP_EQUIL_MAX: string
  P_TEMP_SURF: string
  P_TEMP_SURF_MIN: string
  P_TEMP_SURF_MAX: string
  P_TYPE: string
  S_TYPE_TEMP: string
  S_RA_TXT: string
  S_DEC_TXT: string
  S_LUMINOSITY: string
  S_HZ_OPT_MIN: string
  S_HZ_OPT_MAX: string
  S_HZ_CON_MIN: string
  S_HZ_CON_MAX: string
  S_HZ_CON0_MIN: string
  S_HZ_CON0_MAX: string
  S_HZ_CON1_MIN: string
  S_HZ_CON1_MAX: string
  S_SNOW_LINE: string
  S_ABIO_ZONE: string
  S_TIDAL_LOCK: string
  P_HABZONE_OPT: string
  P_HABZONE_CON: string
  P_TYPE_TEMP: string
  P_HABITABLE: string
  P_ESI: string
  S_CONSTELLATION: string
  S_CONSTELLATION_ABR: string
  S_CONSTELLATION_ENG: string
}

const PlanetAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planetData, setPlanetData] = useState<PlanetData | null>(null);
  const [planetCatalog, setPlanetCatalog] = useState<PlanetCatalog[]>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<string>("");

  // Form state
  const [formData, setFormData] = useState({
    // Planet parameters
    pl_mass: '',
    pl_radius: '',
    pl_density: '',
    pl_orb_period: '',
    pl_ecc: '',
    // Stellar parameters
    stellar_temp: '',
    stellar_metal: '',
    stellar_log_lum: '',
    stellar_age: '',
    stellar_dist: '',
  });

  const radiationColors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
  };

  // Planet type descriptions
  const planetDescriptions = {
    'Earth-like': 'A rocky planet with conditions similar to Earth, potentially suitable for human habitation.',
    'Gas Giant': 'A massive planet composed mainly of hydrogen and helium, similar to Jupiter or Saturn.',
    'Super Earth': 'A rocky planet with greater mass than Earth but substantially smaller than ice giants.',
    'Ocean World': 'A planet where the surface is completely or predominantly covered by a global ocean.',
    'Desert Planet': 'An arid planet with minimal water content and large desert areas.',
    'Ice Planet': 'A frozen world with surface temperatures consistently below waters freezing point.'
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

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handlePlanetSelect = (value: string) => {
    setSelectedPlanet(value);

    const planet = planetCatalog.find(p => p.P_NAME === value);

    if (planet) {
      setFormData({
        pl_mass: planet.P_MASS.toString(),
        pl_radius: planet.P_RADIUS.toString(),
        pl_density: planet.P_DENSITY.toString(),
        pl_orb_period: planet.P_PERIOD.toString() || (Math.random() * 365 + 1).toFixed(2),
        pl_ecc: planet.P_ECCENTRICITY.toString() || Math.random().toFixed(2),
        stellar_temp: planet.S_TEMPERATURE.toString() || (Math.random() * 10000 + 2500).toFixed(2),
        stellar_metal: planet.S_METALLICITY.toString() || (Math.random() * 1.5 - 0.5).toFixed(2),
        stellar_log_lum: planet.S_LOG_LUM.toString() || (Math.random() * 6 - 3).toFixed(2),
        stellar_age: planet.S_AGE.toString() || (Math.random() * 10 + 1).toFixed(2),
        stellar_dist: planet.S_DISTANCE.toString() || (Math.random() * 1000 + 1).toFixed(2),
      });
    }
  };

  const handleRandomPlanet = () => {
    const pl_mass = (Math.random() * 180 - 90).toFixed(2);
    const pl_radius = (Math.random() * 360 - 180).toFixed(2);
    setFormData({
      pl_mass,
      pl_radius,
      pl_density: (
        parseFloat(pl_mass) /
        ((4 / 3) * Math.PI * Math.pow(parseFloat(pl_radius), 3) || 1)
      ).toFixed(6),
      pl_orb_period: (Math.random() * 365 + 1).toFixed(2), // 1-365 days
      pl_ecc: Math.random().toFixed(2), // Eccentricity (0 to 1)
      stellar_temp: (Math.random() * 10000 + 2500).toFixed(2), // 2500K - 12500K
      stellar_metal: (Math.random() * 1.5 - 0.5).toFixed(2), // -0.5 to 1.0
      stellar_log_lum: (Math.random() * 6 - 3).toFixed(2), // -3 to 3
      stellar_age: (Math.random() * 10 + 1).toFixed(2), // 1-10 billion years
      stellar_dist: (Math.random() * 1000 + 1).toFixed(2), // 1-1000 light-years
    });

    setSelectedPlanet("");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulate API call to your FastAPI backend
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

      // Mock response - replace with your actual API response
      const mockData: PlanetData = {
        planetType: ['Earth-like', 'Gas Giant', 'Super Earth', 'Ocean World', 'Desert Planet', 'Ice Planet'][Math.floor(Math.random() * 6)],
        radiationLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        gasComposition: [
          { gas: 'Oxygen', percentage: Math.random() * 30 },
          { gas: 'Nitrogen', percentage: Math.random() * 50 + 40 },
          { gas: 'Carbon Dioxide', percentage: Math.random() * 10 },
          { gas: 'Methane', percentage: Math.random() * 5 },
          { gas: 'Argon', percentage: Math.random() * 5 },
        ],
      };

      setPlanetData(mockData);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
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
                Select a known planet or enter custom parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Planet Selection Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="planet-select" className="text-white">
                    Known Exoplanet
                  </Label>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Select value={selectedPlanet} onValueChange={handlePlanetSelect}>
                      <SelectTrigger id="planet-select" className="w-full bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select a planet" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a27] border-gray-800 text-white">
                        {planetCatalog.map((planet) => (
                          <SelectItem key={planet.P_NAME} value={planet.P_NAME} className="focus:bg-white/10 focus:text-white">
                            {planet.P_NAME}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

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
              </form>

              {error && (
                <Alert variant="destructive" className="mt-4 bg-red-900/20 border-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
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
                        {selectedPlanet ? `Analysis of ${selectedPlanet}` : 'Identified planet type based on submitted parameters'}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white/5 p-4 rounded-xl">
                      <h3 className="text-2xl font-bold text-blue-400 mb-2">{planetData.planetType}</h3>
                      <p className="text-gray-300">
                        {planetDescriptions[planetData.planetType as keyof typeof planetDescriptions] || 'A planet with unique characteristics.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Radiation Level Card */}
                <Card className="bg-[rgba(14,14,21,0.8)] border-gray-800 backdrop-blur-xl shadow-xl overflow-hidden">
                  <div className={`h-2 ${radiationColors[planetData.radiationLevel]}`}></div>
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
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${radiationColors[planetData.radiationLevel]}`}>
                        <span className="text-white font-bold uppercase">{planetData.radiationLevel}</span>
                      </div>
                      <div>
                        <p className="text-gray-300">
                          {planetData.radiationLevel === 'low' && 'Safe for long-term habitation with minimal protection.'}
                          {planetData.radiationLevel === 'medium' && 'Moderate risk. Radiation shielding recommended for extended exposure.'}
                          {planetData.radiationLevel === 'high' && 'Dangerous levels. Specialized radiation shielding required for any surface activity.'}
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
                      {planetData.gasComposition.map((gas, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">{gas.gas}</span>
                            <span className="text-gray-400">{gas.percentage.toFixed(2)}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div
                              className="bg-gradient-to-r from-blue-400 to-indigo-600 h-2.5 rounded-full"
                              style={{ width: `${gas.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-[rgba(14,14,21,0.8)] border-gray-800 backdrop-blur-xl shadow-xl h-full flex items-center justify-center">
                <CardContent className="text-center p-12">
                  <div className="bg-white/5 p-8 rounded-xl">
                    <Globe className="h-16 w-16 text-blue-400 mx-auto mb-6 opacity-50" />
                    <h3 className="text-xl font-semibold text-gray-300 mb-4">No Planet Data Yet</h3>
                    <p className="text-gray-400">
                      Select a known planet from the dropdown, generate random parameters, or submit custom values to receive a detailed analysis.
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