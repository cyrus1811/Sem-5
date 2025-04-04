import React, { useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Home, Droplet, ThermometerSun, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { HabitabilityResult, HabitabilityCheckProps } from '@/types/types';

const Habitability_Analysis: React.FC<HabitabilityCheckProps> = ({ formData, selectedPlanet }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [habitabilityData, setHabitabilityData] = useState<HabitabilityResult | null>(null);
  const [open, setOpen] = useState(false);

  const checkHabitability = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/predict-habitability`, {
        P_TEMP_SURF: parseFloat(formData.pl_surf_temp),
        P_RADIUS: parseFloat(formData.pl_radius),
        P_TEMP_SURF_MIN: parseFloat(formData.pl_surf_temp_min),
        S_LOG_G: parseFloat(formData.stellar_log_lum),
        S_DISTANCE_ERROR_MIN: parseFloat(formData.stellar_dist_error_min),
        P_ECCENTRICITY_LIMIT: parseFloat(formData.pl_ecc_limit),
        S_ABIO_ZONE: parseFloat(formData.stellar_abio_zone),
        P_FLUX: parseFloat(formData.pl_flux),
        S_DISTANCE_ERROR_MAX: parseFloat(formData.stellar_dist_error_max),
      });

      setHabitabilityData(response.data);
      setOpen(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getESICategory = (esi: number) => {
    if (esi >= 0.8) return { label: "Earth-like", color: "bg-green-500" };
    if (esi >= 0.6) return { label: "Very Similar", color: "bg-emerald-500" };
    if (esi >= 0.4) return { label: "Similar", color: "bg-yellow-500" };
    return { label: "Not Similar", color: "bg-red-500" };
  };

  const getHabitableCategory = (habitable: number) => {
    if (habitable >= 0.9) return { label: "Highly Habitable", color: "bg-green-500" };
    if (habitable >= 0.7) return { label: "Potentially Habitable", color: "bg-emerald-500" };
    if (habitable >= 0.5) return { label: "Marginally Habitable", color: "bg-yellow-500" };
    return { label: "Not Habitable", color: "bg-red-500" };
  };

  const getHabZoneCategory = (habZone: number) => {
    if (habZone > 0.9) return { label: "Goldilocks Zone", color: "bg-green-500" };
    if (habZone > 0.6) return { label: "Habitable Zone", color: "bg-yellow-500" };
    return { label: "Outside Habitable Zone", color: "bg-red-500" };
  };

  const getProgressBarWidth = (value: number) => {
    return `${Math.min(value * 100, 100)}%`;
  };

  return (
    <>
      <Button
        onClick={checkHabitability}
        className="w-full mt-4 py-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 transition-all duration-300"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Checking Habitability...
          </>
        ) : (
          <>
            <Home className="mr-2 h-4 w-4" />
            Check Habitability Potential
          </>
        )}
      </Button>

      {error && (
        <Alert variant="destructive" className="mt-4 bg-red-900/20 border-red-800">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[rgba(14,14,21,0.95)] border-gray-800 backdrop-blur-xl text-white max-w-2xl max-h-[80vh] h-auto overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-2xl font-bold">
              Habitability Analysis{selectedPlanet ? ` for ${selectedPlanet}` : ''}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Detailed assessment of planetary habitability factors
            </DialogDescription>
          </DialogHeader>

          {habitabilityData && (
            <div className="space-y-6 py-4 overflow-y-auto pr-2 flex-grow">
              {/* Earth Similarity Index */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-medium text-blue-400">Earth Similarity Index (ESI)</h3>
                </div>
                <Card className="bg-white/5 border-gray-800">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Similarity Score</span>
                      <Badge className={`${getESICategory(habitabilityData.P_ESI).color}`}>
                        {getESICategory(habitabilityData.P_ESI).label}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                      <div
                        className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full"
                        style={{ width: getProgressBarWidth(habitabilityData.P_ESI) }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>0.0</span>
                      <span>0.5</span>
                      <span>1.0</span>
                    </div>
                    <p className="mt-4 text-gray-300 text-sm">
                      ESI value: <span className="font-bold text-white">{habitabilityData.P_ESI.toFixed(4)}</span>
                      <br />
                      {habitabilityData.P_ESI >= 0.8 
                        ? "This planet has very Earth-like properties in terms of size, density, gravity, and temperature."
                        : habitabilityData.P_ESI >= 0.6
                          ? "This planet shares several key characteristics with Earth, suggesting potential for Earth-like conditions."
                          : habitabilityData.P_ESI >= 0.4
                            ? "This planet has some similarities to Earth, but differs in important ways."
                            : "This planet has few similarities to Earth."}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Habitability Score */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <ThermometerSun className="h-5 w-5 text-green-400" />
                  <h3 className="text-lg font-medium text-green-400">Habitability Index</h3>
                </div>
                <Card className="bg-white/5 border-gray-800">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Habitability Assessment</span>
                      <Badge className={`${getHabitableCategory(habitabilityData.P_HABITABLE).color}`}>
                        {getHabitableCategory(habitabilityData.P_HABITABLE).label}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                      <div
                        className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full"
                        style={{ width: getProgressBarWidth(habitabilityData.P_HABITABLE) }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>0.0</span>
                      <span>0.5</span>
                      <span>1.0</span>
                    </div>
                    <p className="mt-4 text-gray-300 text-sm">
                      Habitability value: <span className="font-bold text-white">{habitabilityData.P_HABITABLE.toFixed(4)}</span>
                      <br />
                      {habitabilityData.P_HABITABLE >= 0.9 
                        ? "This planet has excellent conditions for supporting Earth-like life forms."
                        : habitabilityData.P_HABITABLE >= 0.7
                          ? "This planet could potentially support some forms of life as we know it."
                          : habitabilityData.P_HABITABLE >= 0.5
                            ? "This planet has limited potential for habitability under specific circumstances."
                            : "This planet is unlikely to support Earth-like life."}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Habitable Zone */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Droplet className="h-5 w-5 text-purple-400" />
                  <h3 className="text-lg font-medium text-purple-400">Habitable Zone Assessment</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-white/5 border-gray-800">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">Optimistic Zone</span>
                        <Badge className={`${getHabZoneCategory(habitabilityData.P_HABZONE_OPT).color}`}>
                          {getHabZoneCategory(habitabilityData.P_HABZONE_OPT).label}
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full"
                          style={{ width: getProgressBarWidth(habitabilityData.P_HABZONE_OPT) }}
                        ></div>
                      </div>
                      <p className="mt-2 text-gray-300 text-sm">
                        Value: <span className="font-bold text-white">{habitabilityData.P_HABZONE_OPT.toFixed(4)}</span>
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-gray-800">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">Conservative Zone</span>
                        <Badge className={`${getHabZoneCategory(habitabilityData.P_HABZONE_CON).color}`}>
                          {getHabZoneCategory(habitabilityData.P_HABZONE_CON).label}
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full"
                          style={{ width: getProgressBarWidth(habitabilityData.P_HABZONE_CON) }}
                        ></div>
                      </div>
                      <p className="mt-2 text-gray-300 text-sm">
                        Value: <span className="font-bold text-white">{habitabilityData.P_HABZONE_CON.toFixed(4)}</span>
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {habitabilityData.P_HABZONE_OPT >= 0.8 || habitabilityData.P_HABZONE_CON >= 0.8 
                    ? "This planet is well-positioned in its star's habitable zone where liquid water could exist on the surface."
                    : habitabilityData.P_HABZONE_OPT >= 0.5 || habitabilityData.P_HABZONE_CON >= 0.5
                      ? "This planet is partially within its star's habitable zone."
                      : "This planet is outside the ideal habitable zone of its star."}
                </p>
              </div>

              {/* Summary Card */}
              <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-gray-800">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">Overall Assessment</h3>
                  <p className="text-gray-300">
                    {habitabilityData.P_ESI >= 0.8 && habitabilityData.P_HABITABLE >= 0.8
                      ? "This planet shows exceptional promise for habitability with Earth-like conditions. It's well positioned in its star's habitable zone and has physical properties similar to Earth."
                      : habitabilityData.P_ESI >= 0.6 && habitabilityData.P_HABITABLE >= 0.6
                        ? "This planet has moderate potential for habitability. While not perfectly Earth-like, it maintains several key conditions that could support some forms of life."
                        : "This planet has limited habitability potential based on current assessment models. Significant differences from Earth-like conditions would make it challenging for Earth-like life to thrive."}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Habitability_Analysis;