import { SimulationParameters } from '../../types';

interface Props {
  parameters: SimulationParameters
  updateSimulation: (newParams: Partial<SimulationParameters>) => void
}

export default function SimulationControls({ parameters, updateSimulation }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="co2-level" className="block text-sm font-medium text-gray-700">
          CO₂ Level (ppm)
        </label>
        <input
          type="range"
          id="co2-level"
          min="0"
          max="1000"
          value={parameters.co2Level}
          onChange={(e) => updateSimulation({ co2Level: Number(e.target.value) })}
          className="w-full"
        />
        <span>{parameters.co2Level} ppm</span>
      </div>
      <div>
        <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">
          Temperature (°C)
        </label>
        <input
          type="range"
          id="temperature"
          min="-50"
          max="50"
          value={parameters.temperature}
          onChange={(e) => updateSimulation({ temperature: Number(e.target.value) })}
          className="w-full"
        />
        <span>{parameters.temperature}°C</span>
      </div>
      <div>
        <label htmlFor="sunlight-intensity" className="block text-sm font-medium text-gray-700">
          Sunlight Intensity
        </label>
        <input
          type="range"
          id="sunlight-intensity"
          min="0"
          max="2"
          step="0.1"
          value={parameters.sunlightIntensity}
          onChange={(e) => updateSimulation({ sunlightIntensity: Number(e.target.value) })}
          className="w-full"
        />
        <span>{parameters.sunlightIntensity}</span>
      </div>
      <div>
        <label htmlFor="water-availability" className="block text-sm font-medium text-gray-700">
          Water Availability
        </label>
        <input
          type="range"
          id="water-availability"
          min="0"
          max="1"
          step="0.1"
          value={parameters.waterAvailability}
          onChange={(e) => updateSimulation({ waterAvailability: Number(e.target.value) })}
          className="w-full"
        />
        <span>{parameters.waterAvailability}</span>
      </div>
    </div>
  )
}

