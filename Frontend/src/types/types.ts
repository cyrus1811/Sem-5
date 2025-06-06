export interface PlanetCatalog {
  P_NAME: string;
  P_DETECTION: string;
  P_DISCOVERY_FACILITY: string;
  P_YEAR: string;
  P_UPDATE: string;
  P_MASS: string;
  P_MASS_ERROR_MIN: string;
  P_MASS_ERROR_MAX: string;
  P_MASS_LIMIT: string;
  P_MASS_ORIGIN: string;
  P_RADIUS: string;
  P_RADIUS_ERROR_MIN: string;
  P_RADIUS_ERROR_MAX: string;
  P_RADIUS_LIMIT: string;
  P_PERIOD: string;
  P_PERIOD_ERROR_MIN: string;
  P_PERIOD_ERROR_MAX: string;
  P_PERIOD_LIMIT: string;
  P_SEMI_MAJOR_AXIS: string;
  P_SEMI_MAJOR_AXIS_ERROR_MIN: string;
  P_SEMI_MAJOR_AXIS_ERROR_MAX: string;
  P_SEMI_MAJOR_AXIS_LIMIT: string;
  P_ECCENTRICITY: string;
  P_ECCENTRICITY_ERROR_MIN: string;
  P_ECCENTRICITY_ERROR_MAX: string;
  P_ECCENTRICITY_LIMIT: string;
  P_INCLINATION: string;
  P_INCLINATION_ERROR_MIN: string;
  P_INCLINATION_ERROR_MAX: string;
  P_INCLINATION_LIMIT: string;
  P_OMEGA: string;
  P_OMEGA_ERROR_MIN: string;
  P_OMEGA_ERROR_MAX: string;
  P_OMEGA_LIMIT: string;
  S_NAME: string;
  S_NAME_HD: string;
  S_NAME_HIP: string;
  S_TYPE: string;
  S_RA: string;
  S_DEC: string;
  S_RA_STR: string;
  S_DEC_STR: string;
  S_MAG: string;
  S_MAG_ERROR_MIN: string;
  S_MAG_ERROR_MAX: string;
  S_DISTANCE: string;
  S_DISTANCE_ERROR_MIN: string;
  S_DISTANCE_ERROR_MAX: string;
  S_TEMPERATURE: string;
  S_TEMPERATURE_ERROR_MIN: string;
  S_TEMPERATURE_ERROR_MAX: string;
  S_TEMPERATURE_LIMIT: string;
  S_MASS: string;
  S_MASS_ERROR_MIN: string;
  S_MASS_ERROR_MAX: string;
  S_MASS_LIMIT: string;
  S_RADIUS: string;
  S_RADIUS_ERROR_MIN: string;
  S_RADIUS_ERROR_MAX: string;
  S_RADIUS_LIMIT: string;
  S_METALLICITY: string;
  S_METALLICITY_ERROR_MIN: string;
  S_METALLICITY_ERROR_MAX: string;
  S_METALLICITY_LIMIT: string;
  S_AGE: string;
  S_AGE_ERROR_MIN: string;
  S_AGE_ERROR_MAX: string;
  S_AGE_LIMIT: string;
  S_LOG_LUM: string;
  S_LOG_LUM_ERROR_MIN: string;
  S_LOG_LUM_ERROR_MAX: string;
  S_LOG_LUM_LIMIT: string;
  S_LOG_G: string;
  S_LOG_G_ERROR_MIN: string;
  S_LOG_G_ERROR_MAX: string;
  S_LOG_G_LIMIT: string;
  P_ESCAPE: string;
  P_POTENTIAL: string;
  P_GRAVITY: string;
  P_DENSITY: string;
  P_HILL_SPHERE: string;
  P_DISTANCE: string;
  P_PERIASTRON: string;
  P_APASTRON: string;
  P_DISTANCE_EFF: string;
  P_FLUX: string;
  P_FLUX_MIN: string;
  P_FLUX_MAX: string;
  P_TEMP_EQUIL: string;
  P_TEMP_EQUIL_MIN: string;
  P_TEMP_EQUIL_MAX: string;
  P_TEMP_SURF: string;
  P_TEMP_SURF_MIN: string;
  P_TEMP_SURF_MAX: string;
  P_TYPE: string;
  S_TYPE_TEMP: string;
  S_RA_TXT: string;
  S_DEC_TXT: string;
  S_LUMINOSITY: string;
  S_HZ_OPT_MIN: string;
  S_HZ_OPT_MAX: string;
  S_HZ_CON_MIN: string;
  S_HZ_CON_MAX: string;
  S_HZ_CON0_MIN: string;
  S_HZ_CON0_MAX: string;
  S_HZ_CON1_MIN: string;
  S_HZ_CON1_MAX: string;
  S_SNOW_LINE: string;
  S_ABIO_ZONE: string;
  S_TIDAL_LOCK: string;
  P_HABZONE_OPT: string;
  P_HABZONE_CON: string;
  P_TYPE_TEMP: string;
  P_HABITABLE: string;
  P_ESI: string;
  S_CONSTELLATION: string;
  S_CONSTELLATION_ABR: string;
  S_CONSTELLATION_ENG: string;
}

export interface PlanetType {
  prediction: string;
  pl_mass: number;
  pl_radius: number;
}

export interface RadiationLevel {
  prediction: string;
}

export interface GasComposition {
  H2O: number;
  CO2: number;
  O2: number;
  N2: number;
  CH4: number;
  N2O: number;
  CO: number;
  O3: number;
  SO2: number;
  NH3: number;
  C2H6: number;
  NO2: number;
}

export interface PlanetData {
  planetType: PlanetType;
  radiationLevel: RadiationLevel;
  gasComposition: GasComposition;
}

export interface HabitabilityResult {
  P_HABZONE_OPT: number;
  P_HABZONE_CON: number;
  P_HABITABLE: number;
  P_ESI: number;
}

export interface HabitabilityCheckProps {
  formData: {
    pl_surf_temp: string;
    pl_radius: string;
    pl_surf_temp_min: string;
    stellar_log_lum: string;
    stellar_dist_error_min: string;
    pl_ecc_limit: string;
    stellar_abio_zone: string;
    pl_flux: string;
    stellar_dist_error_max: string;
  };
  selectedPlanet: string;
}

export type Asteroid = {
  id: number;
  position: [number, number, number];
  velocity: [number, number, number];
};

export type PlanetPositionData = {
  x: number;
  z: number;
  size: number;
};

export type MoonData = {
  color: string;
  size: number;
  distance: number;
  speed: number;
  texture?: string;
  bumpMap?: string;
};

export type StarData = {
  color: string;
  size: number;
  distance: number;
  speed: number;
};

export type SandboxPlanetData = {
  id: number;
  color: string;
  size: number;
  distance: number;
  speed: number;
  moons: MoonData[];
  stars: StarData[];
  hasRings: boolean;
  ringSize: number;
  ringColor: string;
  ringInnerRadius: number;
  ringOuterRadius: number;
  // New texture properties
  texture?: string;
  bumpMap?: string;
  specularMap?: string;
  cloudTexture?: string;
  hasAtmosphere?: boolean;
};

export type CanvasProps = {
  asteroids: Asteroid[];
  planets: SandboxPlanetData[];
  planetPositions: PlanetPositionData[];
  handleAsteroidImpact: (id: number) => void;
  updatePlanetPosition: (index: number, x: number, z: number) => void;
  handlePlanetClick: (id: number) => void;
  selectedPlanetId: number | null;
};

export type FormData = {
  planetColor: string;
  planetSize: number;
  planetDistance: number;
  planetSpeed: number;
  moonColor: string;
  moonSize: number;
  moonDistance: number;
  moonSpeed: number;
  starColor: string;
  starSize: number;
  starDistance: number;
  starSpeed: number;
  hasRings: boolean;
  ringColor: string;
  ringSize: number;
  ringInnerRadius: number;
  ringOuterRadius: number;
};

export type PlanetFormProps = {
  planetColor: string;
  setPlanetColor: (color: string) => void;
  planetSize: number;
  setPlanetSize: (size: number) => void;
  planetDistance: number;
  setPlanetDistance: (distance: number) => void;
  planetSpeed: number;
  setPlanetSpeed: (speed: number) => void;
};

export type RingFormProps = {
  hasRings: boolean;
  setHasRings: (hasRings: boolean) => void;
  ringColor: string;
  setRingColor: (color: string) => void;
  ringSize: number;
  setRingSize: (size: number) => void;
  ringInnerRadius: number;
  setRingInnerRadius: (radius: number) => void;
  ringOuterRadius: number;
  setRingOuterRadius: (radius: number) => void;
};

export type StarFormProps = {
  starColor: string;
  setStarColor: (color: string) => void;
  starSize: number;
  setStarSize: (size: number) => void;
  starDistance: number;
  setStarDistance: (distance: number) => void;
  starSpeed: number;
  setStarSpeed: (speed: number) => void;
};

export type MoonFormProps = {
  moonColor: string;
  setMoonColor: (color: string) => void;
  moonSize: number;
  setMoonSize: (size: number) => void;
  moonDistance: number;
  setMoonDistance: (distance: number) => void;
  moonSpeed: number;
  setMoonSpeed: (speed: number) => void;
};

export type ActionButtonsProps = {
  isEditing: boolean;
  resetForm: () => void;
  setPlanets: React.Dispatch<React.SetStateAction<SandboxPlanetData[]>>;
  setPlanetPositions: React.Dispatch<
    React.SetStateAction<PlanetPositionData[]>
  >;
  selectedPlanetId: number | null;
  planets: SandboxPlanetData[];
  planetColor: string;
  planetSize: number;
  planetDistance: number;
  planetSpeed: number;
  moonColor: string;
  moonSize: number;
  moonDistance: number;
  moonSpeed: number;
  starColor: string;
  starSize: number;
  starDistance: number;
  starSpeed: number;
  hasRings: boolean;
  ringSize: number;
  ringColor: string;
  ringInnerRadius: number;
  ringOuterRadius: number;
  setAsteroids: React.Dispatch<React.SetStateAction<Asteroid[]>>;
  planetTexture?: string;
  setPlanetTexture: React.Dispatch<React.SetStateAction<string>>;
  moonTexture?: string;
  setMoonTexture: React.Dispatch<React.SetStateAction<string>>;
  planetBumpMap?: string;
  setPlanetBumpMap: React.Dispatch<React.SetStateAction<string>>;
  moonBumpMap?: string;
  setMoonBumpMap: React.Dispatch<React.SetStateAction<string>>;
  planetSpecularMap?: string;
  setPlanetSpecularMap: React.Dispatch<React.SetStateAction<string>>;
  planetCloudTexture?: string;
  setPlanetCloudTexture: React.Dispatch<React.SetStateAction<string>>;
  planetAtmosphere?: boolean;
  setPlanetAtmosphere: React.Dispatch<React.SetStateAction<boolean>>;
};

export type TabsProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: Array<{
    source: {
      id: string | null;
      name: string;
    };
    author: string | null;
    title: string;
    description: string;
    url: string;
    urlToImage?: string;
    publishedAt: string;
    content: string;
  }>;
}

export interface NewsArticle {
  year: string;
  title: string;
  description: string;
  url?: string;
}

export interface ProminentElement {
  element: string;
  percentage: number;
}

export interface ClosestStar {
  name: string;
  proximity: number;
}

export interface SurfaceTemperature {
  min?: number;
  max?: number;
  average?: number;
}

export interface Planet {
  name: string;
  gltfModel: string;
  thumbnail: string;
  radius: number;
  closestStar: ClosestStar;
  prominentElements: ProminentElement[];
  habitabilityScore: number;
  smallDescription: string;
  largeDescription: string;
  orbitalSpeed: number;
  timeToOrbit: number;
  volume: number;
  mass: number;
  circumference: number;
  escapeVelocity: number;
  surfaceTemperature: SurfaceTemperature;
  surfacePressure: number;
}

export interface PlanetFilters {
  habitabilityRange?: [number, number];
  closestStarProximity?: [number, number];
  prominentElements?: string[];
  surfaceTemperatureRange?: [number, number];
}
