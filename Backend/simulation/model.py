from typing import List, Dict
from mesa import Model, Agent
from mesa.space import MultiGrid
from mesa.time import RandomActivation

class Plant(Agent):
    def __init__(self, unique_id, model):
        # Correct way to initialize an Agent in Mesa
        super().__init__(unique_id, model)
        self.energy = 5

    def step(self):
        # Plants grow if there is enough sunlight, CO2, and water
        if (self.model.sunlight_intensity > 5 and
                self.model.co2 > 5 and
                self.model.water_availability > 5):
            self.energy += 1
        else:
            self.energy -= 1

class EcosystemModel(Model):
    def __init__(self, width, height, co2, temperature, sunlight_intensity, water_availability):
        # Properly initialize the Model base class with a scheduler
        super().__init__()
        
        # Use RandomActivation scheduler to manage agents
        self.schedule = RandomActivation(self)
        
        self.grid = MultiGrid(width, height, True)
        self.steps = 0  # Initialize step counter

        # Environmental variables
        self.co2 = co2
        self.temperature = temperature
        self.sunlight_intensity = sunlight_intensity
        self.water_availability = water_availability

        # Initialize agents
        for i in range(10):
            plant = Plant(i, self)
            x = self.random.randrange(width)
            y = self.random.randrange(height)
            self.grid.place_agent(plant, (x, y))
            self.schedule.add(plant)  # Use schedule.add instead of agents.add

    def step(self):
        self.schedule.step()  # Use schedule.step() instead of agents.shuffle_do
        self.steps += 1

    def get_state(self) -> List[Dict]:
        """Get the current state of the ecosystem."""
        state = []
        for agent in self.schedule.agents:  # Iterate through schedule.agents
            state.append({
                "id": agent.unique_id,
                "energy": agent.energy
            })
        return state