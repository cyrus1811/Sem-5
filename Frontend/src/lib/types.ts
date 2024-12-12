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
