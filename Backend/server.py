from fastapi import FastAPI, HTTPException, Request
import joblib
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from simulation.model import EcosystemModel
from fastapi.responses import JSONResponse, Response

app = FastAPI()

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://127.0.0.1:5174"],  # Explicitly list the allowed frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
try:
    scaler = joblib.load("./models/scaler.joblib")
    type_of_planet = joblib.load("./models/type_of_planet.joblib")
    print("Models loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")

class PredictionInput(BaseModel):
    pl_mass: float
    pl_radius: float

# Mapping of prediction numbers to labels
planet_type_labels = {
    0: "Jovian",
    1: "Miniterran",
    2: "Neptunian",
    3: "Subterran",
    4: "Superterran",
    5: "Terran"
}

@app.get("/")
async def root():
    return {"message": "Hello, World"}

@app.post("/predict-planet-type")
async def predict_planet_type(input_data: PredictionInput):
    try:
        # Validate input
        if input_data.pl_mass <= 0:
            raise HTTPException(status_code=400, detail="Mass must be greater than zero.")
        if input_data.pl_radius <= 0:
            raise HTTPException(status_code=400, detail="Radius must be greater than zero.")
        
        print(input_data)
        pl_density = input_data.pl_mass / ((4/3) * 3.14 * (input_data.pl_radius ** 3))
        # Prepare data in the correct format
        data = [[input_data.pl_mass, input_data.pl_radius, pl_density]]
        
        # Check data input
        print(f"Input data: {data}")

        scaled_data = scaler.transform(data)
        print(f"Scaled data: {scaled_data}")
        
        # Get the prediction and ensure it's an int
        prediction = type_of_planet.predict(scaled_data)
        print(f"Raw prediction output: {prediction}")
        
        prediction = int(prediction[0])  # Get the first element if it’s an array
        
        # Get the label from the dictionary
        prediction_label = planet_type_labels.get(prediction, "Unknown")
        return {"prediction": prediction_label}
    except TypeError as e:
        raise HTTPException(status_code=400, detail=f"Data type error: {e}")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Value error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")

class EnvironmentInput(BaseModel):
    co2: float
    temperature: float
    sunlight_intensity: float
    water_availability: float

model = None

@app.post("/simulate")
def simulate_environment(environment: EnvironmentInput):
    global model

    model = EcosystemModel(
        width=10,
        height=10,
        co2=environment.co2,
        temperature=environment.temperature,
        sunlight_intensity=environment.sunlight_intensity,
        water_availability=environment.water_availability
    )

    # Run one step of the simulation
    model.step()

    # Get the current state
    state = model.get_state()

    return JSONResponse(
        content={
            "environment": environment.model_dump(),
            "ecosystem_state": state
        }
    )

@app.get("/state")
def get_current_state():
    if model is None:
        return {"error": "No simulation has been run yet."}
    
    # Get the current state of the model
    state = model.get_state()
    return {
        "ecosystem_state": state
    }
