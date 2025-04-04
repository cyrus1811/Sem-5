from pydantic import BaseModel

class PlanetPredictionInput(BaseModel):
    pl_mass: float
    pl_radius: float

class RadiationPredictionInput(BaseModel):
    stellar_temp: float
    stellar_metal: float
    stellar_log_lum: float
    stellar_age: float
    stellar_dist: float
    pl_mass: float 
    pl_radius: float

class GasPredictionInput(BaseModel):
    spectrum: list[float] 
    planetary_features: list[float]


class PlanetType(BaseModel):
    prediction: str
    pl_mass: float
    pl_radius: float

class RadiationLevel(BaseModel):
    prediction: str

class GasComposition(BaseModel):
    H2O: float
    CO2: float
    O2: float
    N2: float
    CH4: float
    N2O: float
    CO: float
    O3: float
    SO2: float
    NH3: float
    C2H6: float
    NO2: float

class PlanetData(BaseModel):
    planetType: PlanetType
    radiationLevel: RadiationLevel
    gasComposition: GasComposition

class PlanetDataRequestModel(BaseModel):
    planetData: PlanetData

class PlanetHabitabilityRequestModel(BaseModel):
    P_TEMP_SURF: float
    P_RADIUS: float
    P_TEMP_SURF_MIN: float
    S_LOG_G: float
    S_DISTANCE_ERROR_MIN: float
    P_ECCENTRICITY_LIMIT: float
    S_ABIO_ZONE: float
    P_FLUX: float
    S_DISTANCE_ERROR_MAX:float