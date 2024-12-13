// @ts-nocheck

import { useState, useEffect } from 'react'
import EcosystemVisualization from './components/pages/EcoSystemVisualization'
import SimulationControls from './components/pages/SimulationControls'
import { SimulationParameters, SimulationResults } from '../src/types'

export default function App() {
  const [simulationParameters, setSimulationParameters] = useState<SimulationParameters>({
    co2Level: 400,
    temperature: 20,
    sunlightIntensity: 1,
    waterAvailability: 0.5,
  })
  const [simulationResults, setSimulationResults] = useState<SimulationResults | null>(null)

  const updateSimulation = (newParams: Partial<SimulationParameters>) => {
    setSimulationParameters(prev => ({ ...prev, ...newParams }))
  }

  useEffect(() => {
    const runSimulation = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/predict-planet-type', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "pl_mass": 0.9,
            "pl_radius": 0.2
          }),
        });
        const results = await response.json();
        setSimulationResults({
          oxygen_level: results.environment.co2,
          co2_level: results.environment.co2,
          num_plants: results.ecosystem_state.length,
          average_plant_size: results.ecosystem_state.reduce((sum, plant) => sum + plant.energy, 0) / results.ecosystem_state.length,
        });
      } catch (error) {
        console.error('Error running simulation:', error);
      }
    };

    runSimulation();
  }, [simulationParameters]);

  return (
    <div className="flex h-screen">
      <div className="w-3/4">
        <EcosystemVisualization parameters={simulationParameters} results={simulationResults} />
      </div>
      <div className="w-1/4 p-4 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Exoplanetary Ecosystem Simulation</h1>
        <SimulationControls parameters={simulationParameters} updateSimulation={updateSimulation} />
        {simulationResults && (
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">Simulation Results</h2>
            <p>Oxygen Level: {simulationResults.oxygen_level.toFixed(2)}</p>
            <p>CO₂ Level: {simulationResults.co2_level.toFixed(2)}</p>
            <p>Number of Plants: {simulationResults.num_plants}</p>
            <p>Average Plant Size: {simulationResults.average_plant_size.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  )
}

