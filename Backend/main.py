from fastapi import FastAPI, HTTPException
import joblib
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from tensorflow import keras
import numpy as np

app = FastAPI()

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
try:
    type_of_planet_scaler = joblib.load("./models/Planet_Type/scaler.joblib")
    type_of_planet = joblib.load("./models/Planet_Type/type_of_planet.joblib")
    print("Type of planet models loaded successfully.")

    radiation_scaler = joblib.load("./models/Radiation/scaler_model.joblib")
    radiation_pca = joblib.load("./models/Radiation/pca_model.joblib")
    radiation = joblib.load("./models/Radiation/radiation_model.joblib")
    print("Radiation models loaded successfully.")

    cnn_gas_model = keras.models.load_model("./models/Gas_Emission/cnn_model.keras")    
    mlp_gas_model = keras.models.load_model("./models/Gas_Emission/mlp_model.keras")    
    fusion_gas_model = keras.models.load_model("./models/Gas_Emission/fusion_model.keras")    
    encoder_gas_model = keras.models.load_model("./models/Gas_Emission/encoder.keras")    
    decoder_gas_model = keras.models.load_model("./models/Gas_Emission/decoder.keras")   
    gas_scaler = joblib.load("./models/Gas_Emission/scaler.pkl")
    print("Gas Prediction models loaded successfully.") 

except Exception as e:
    print(f"Error loading model: {e}")

class PlanetPredictionInput(BaseModel):
    pl_mass: float
    pl_radius: float

class RadiationPredictionInput(BaseModel):
    stellar_temp: float
    stellar_metal: float
    stellar_log_lum: float
    stellar_age: float
    stellar_dist: float
    pl_mass: float  # Added from predict-planet-type
    pl_radius: float  # Added from predict-planet-type

class GasPredictionInput(BaseModel):
    spectrum: list[float] 
    planetary_features: list[float]

planet_type_labels = {
    0: "Jovian",
    1: "Miniterran",
    2: "Neptunian",
    3: "Subterran",
    4: "Superterran",
    5: "Terran"
}

radiation_labels = {
    0: "Low", 0.0: "Low",
    1: "Medium", 1.0: "Medium",
    2: "High", 2.0: "High",
}

@app.post("/predict-planet-type")
async def predict_planet_type(input_data: PlanetPredictionInput):
    try:
        if input_data.pl_mass <= 0 or input_data.pl_radius <= 0:
            raise HTTPException(status_code=400, detail="Mass and Radius must be greater than zero.")
        
        pl_density = input_data.pl_mass / ((4/3) * 3.14 * (input_data.pl_radius ** 3))
        data = [[input_data.pl_mass, input_data.pl_radius, pl_density]]

        scaled_data = type_of_planet_scaler.transform(data)
        prediction = int(type_of_planet.predict(scaled_data)[0])  
        prediction_label = planet_type_labels.get(prediction, "Unknown")

        return {
            "prediction": prediction_label,
            "pl_mass": input_data.pl_mass,
            "pl_radius": input_data.pl_radius
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")

@app.post("/predict-radiation")
async def predict_radiation(input_data: RadiationPredictionInput):
    try:

        data = [[
            input_data.stellar_temp, input_data.stellar_metal,
            input_data.stellar_log_lum, input_data.stellar_age, input_data.stellar_dist,
            input_data.pl_radius, input_data.pl_mass 
        ]]

        scaled_data = radiation_scaler.transform(data)
        pca_data = radiation_pca.transform(scaled_data)
        prediction = int(radiation.predict(pca_data)[0])
        prediction_label = radiation_labels.get(prediction, "Unknown")

        return {"prediction": prediction_label}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")
    
@app.post("/predict-gas")
def predict_gas(input_data: GasPredictionInput):
    # Convert inputs to numpy arrays
    spectrum = np.array(input_data.spectrum).reshape(-1, 100, 1)  # Ensure correct shape
    planetary_features = np.array(input_data.planetary_features).reshape(1, -1)
    
    # Scale planetary features
    planetary_scaled = gas_scaler.transform(planetary_features)
    
    # Get latent representations
    cnn_features = cnn_gas_model.predict(spectrum)
    mlp_features = mlp_gas_model.predict(planetary_scaled)
    
    # Fuse features and predict gas composition
    final_features = np.concatenate((cnn_features, mlp_features), axis=1)
    predicted_gas_latent = fusion_gas_model.predict(final_features)
    
    # Decode gas predictions
    predicted_gases = decoder_gas_model.predict(predicted_gas_latent)

    # Convert results into a dictionary
    gas_labels = ["H2O", "CO2", "O2", "N2", "CH4", "N2O", "CO", "O3", "SO2", "NH3", "C2H6", "NO2"]
    result = {gas: float(percentage) for gas, percentage in zip(gas_labels, predicted_gases[0])}

    return {"predicted_gases": result}


# class EnvironmentInput(BaseModel):
#     co2: float
#     temperature: float
#     sunlight_intensity: float
#     water_availability: float

# model = None

# @app.post("/simulate")
# def simulate_environment(environment: EnvironmentInput):
#     global model

#     model = EcosystemModel(
#         width=10,
#         height=10,
#         co2=environment.co2,
#         temperature=environment.temperature,
#         sunlight_intensity=environment.sunlight_intensity,
#         water_availability=environment.water_availability
#     )

#     # Run one step of the simulation
#     model.step()

#     # Get the current state
#     state = model.get_state()

#     return JSONResponse(
#         content={
#             "environment": environment.model_dump(),
#             "ecosystem_state": state
#         }
#     )

# @app.get("/state")
# def get_current_state():
#     if model is None:
#         return {"error": "No simulation has been run yet."}
    
#     # Get the current state of the model
#     state = model.get_state()
#     return {
#         "ecosystem_state": state
#     }
