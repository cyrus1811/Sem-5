from fastapi import FastAPI, HTTPException
import joblib, os, requests
from fastapi.middleware.cors import CORSMiddleware
from tensorflow import keras
import numpy as np
import pandas as pd
from schemas.schemas import PlanetPredictionInput, RadiationPredictionInput, GasPredictionInput, PlanetData, PlanetDataRequestModel, PlanetHabitabilityRequestModel
from dotenv import load_dotenv
from fastapi.responses import JSONResponse
import google.generativeai as genai

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)
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

    simple_imputer = joblib.load("./models/Habitability/imputer.joblib")
    multioutput_rf = joblib.load("./models/Habitability/multioutput_rf.joblib")
    habitability_scaler = joblib.load("./models/Habitability/feature_scaler.joblib")
    print("Habitability models loaded successfully.")

except Exception as e:
    print(f"Error loading model: {e}")

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

@app.post("/gen-ai")
def get_gemini_response(request: PlanetDataRequestModel):
    planet_data = request.planetData
    
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API key is missing")
    
    # Construct the prompt
    prompt = f"""
    You are an expert in planetary science analyzing an exoplanet based on its characteristics.  

    ### **Planetary Data**  
    - **Mass**: {planet_data.planetType.pl_mass} Earth masses  
    - **Radius**: {planet_data.planetType.pl_radius} Earth radii  
    - **Radiation Level**: {planet_data.radiationLevel.prediction}  
    - **Atmospheric Composition**:  
    {', '.join([f"{gas}: {concentration:.2%}" for gas, concentration in planet_data.gasComposition.dict().items()])}  

    ### **Task:**  
    1. **Key Observations:**  
    - Analyze the significance of the atmospheric composition.  
    - Identify the dominant gases and their potential effects on temperature, pressure, and climate.  
    - Highlight any toxic or greenhouse gases that could make the planet uninhabitable.  

    2. **Planet Type:**  
    - Based on mass, radius, and atmosphere, categorize this planet (e.g., terrestrial, gas giant, ocean world, or Venus-like).  
    - Compare it to known planets, if applicable.  

    3. **Suitability for Life:**  
    - Assess whether this planet could support Earth-like life.  
    - Consider temperature effects, potential toxicity, and other habitability factors.  

    ### **Response Format:**
    Your response should be in the following JSON structure:
        {{
            "Key Observations": {{
                "Atmospheric Composition Analysis": "",
                "Dominant Gases and Their Effects": {{
                "Gas Name 1": "",
                "Gas Name 2": "",
                "Gas Name 3": ""
                // Add more gases as needed
                }},
                "Toxic and Greenhouse Gases": ""
            }},
            "Planet Type": {{
                "Classification": "",
                "Comparison to Known Planets": ""
            }},
            "Suitability for Life": {{
                "Explanation": "",
                "Suitability": "Yes/No"
            }}
        }}

    Make the response **detailed, analytical, and scientifically accurate** while being clear and easy to understand in a json forms.
    """
    
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt)

        print(response)

        return {"planet_analysis": response.text if response else "No response from Gemini."}

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error communicating with Gemini: {str(e)}")
    
@app.post("/predict-habitability")
def predict_habitability(input_data: PlanetHabitabilityRequestModel):
    try:
        # Define output targets
        target_columns = ["P_HABZONE_OPT", "P_HABZONE_CON", "P_HABITABLE", "P_ESI"]

        input_df = pd.DataFrame([input_data.dict()])

        input_imputed = pd.DataFrame(
            simple_imputer.transform(input_df), columns=input_df.columns
        )

        input_scaled = pd.DataFrame(
            habitability_scaler.transform(input_imputed), columns=input_df.columns
        )

        prediction = multioutput_rf.predict(input_scaled)

        result = {name: float(value) for name, value in zip(target_columns, prediction[0])}

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/news")
def get_news():
    api_key_url = os.getenv("NEWS_API")
    
    response = requests.get(api_key_url)
    if response.status_code != 200:
        return JSONResponse(status_code=response.status_code, content={"error": "Failed to fetch news"})
    
    return response.json()