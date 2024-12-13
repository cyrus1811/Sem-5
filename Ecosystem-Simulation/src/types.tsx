export interface SimulationParameters {
    co2Level: number
    temperature: number
    sunlightIntensity: number
    waterAvailability: number
  }
  
  export interface SimulationResults {
    oxygen_level: number
    co2_level: number
    num_plants: number
    average_plant_size: number
  }
  
  