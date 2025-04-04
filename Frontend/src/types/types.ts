export interface PlanetCatalog {
    P_NAME: string
    P_DETECTION: string
    P_DISCOVERY_FACILITY: string
    P_YEAR: string
    P_UPDATE: string
    P_MASS: string
    P_MASS_ERROR_MIN: string
    P_MASS_ERROR_MAX: string
    P_MASS_LIMIT: string
    P_MASS_ORIGIN: string
    P_RADIUS: string
    P_RADIUS_ERROR_MIN: string
    P_RADIUS_ERROR_MAX: string
    P_RADIUS_LIMIT: string
    P_PERIOD: string
    P_PERIOD_ERROR_MIN: string
    P_PERIOD_ERROR_MAX: string
    P_PERIOD_LIMIT: string
    P_SEMI_MAJOR_AXIS: string
    P_SEMI_MAJOR_AXIS_ERROR_MIN: string
    P_SEMI_MAJOR_AXIS_ERROR_MAX: string
    P_SEMI_MAJOR_AXIS_LIMIT: string
    P_ECCENTRICITY: string
    P_ECCENTRICITY_ERROR_MIN: string
    P_ECCENTRICITY_ERROR_MAX: string
    P_ECCENTRICITY_LIMIT: string
    P_INCLINATION: string
    P_INCLINATION_ERROR_MIN: string
    P_INCLINATION_ERROR_MAX: string
    P_INCLINATION_LIMIT: string
    P_OMEGA: string
    P_OMEGA_ERROR_MIN: string
    P_OMEGA_ERROR_MAX: string
    P_OMEGA_LIMIT: string
    S_NAME: string
    S_NAME_HD: string
    S_NAME_HIP: string
    S_TYPE: string
    S_RA: string
    S_DEC: string
    S_RA_STR: string
    S_DEC_STR: string
    S_MAG: string
    S_MAG_ERROR_MIN: string
    S_MAG_ERROR_MAX: string
    S_DISTANCE: string
    S_DISTANCE_ERROR_MIN: string
    S_DISTANCE_ERROR_MAX: string
    S_TEMPERATURE: string
    S_TEMPERATURE_ERROR_MIN: string
    S_TEMPERATURE_ERROR_MAX: string
    S_TEMPERATURE_LIMIT: string
    S_MASS: string
    S_MASS_ERROR_MIN: string
    S_MASS_ERROR_MAX: string
    S_MASS_LIMIT: string
    S_RADIUS: string
    S_RADIUS_ERROR_MIN: string
    S_RADIUS_ERROR_MAX: string
    S_RADIUS_LIMIT: string
    S_METALLICITY: string
    S_METALLICITY_ERROR_MIN: string
    S_METALLICITY_ERROR_MAX: string
    S_METALLICITY_LIMIT: string
    S_AGE: string
    S_AGE_ERROR_MIN: string
    S_AGE_ERROR_MAX: string
    S_AGE_LIMIT: string
    S_LOG_LUM: string
    S_LOG_LUM_ERROR_MIN: string
    S_LOG_LUM_ERROR_MAX: string
    S_LOG_LUM_LIMIT: string
    S_LOG_G: string
    S_LOG_G_ERROR_MIN: string
    S_LOG_G_ERROR_MAX: string
    S_LOG_G_LIMIT: string
    P_ESCAPE: string
    P_POTENTIAL: string
    P_GRAVITY: string
    P_DENSITY: string
    P_HILL_SPHERE: string
    P_DISTANCE: string
    P_PERIASTRON: string
    P_APASTRON: string
    P_DISTANCE_EFF: string
    P_FLUX: string
    P_FLUX_MIN: string
    P_FLUX_MAX: string
    P_TEMP_EQUIL: string
    P_TEMP_EQUIL_MIN: string
    P_TEMP_EQUIL_MAX: string
    P_TEMP_SURF: string
    P_TEMP_SURF_MIN: string
    P_TEMP_SURF_MAX: string
    P_TYPE: string
    S_TYPE_TEMP: string
    S_RA_TXT: string
    S_DEC_TXT: string
    S_LUMINOSITY: string
    S_HZ_OPT_MIN: string
    S_HZ_OPT_MAX: string
    S_HZ_CON_MIN: string
    S_HZ_CON_MAX: string
    S_HZ_CON0_MIN: string
    S_HZ_CON0_MAX: string
    S_HZ_CON1_MIN: string
    S_HZ_CON1_MAX: string
    S_SNOW_LINE: string
    S_ABIO_ZONE: string
    S_TIDAL_LOCK: string
    P_HABZONE_OPT: string
    P_HABZONE_CON: string
    P_TYPE_TEMP: string
    P_HABITABLE: string
    P_ESI: string
    S_CONSTELLATION: string
    S_CONSTELLATION_ABR: string
    S_CONSTELLATION_ENG: string
}

export interface PlanetType {
    prediction: string
    pl_mass: number
    pl_radius: number
}

export interface RadiationLevel {
    prediction: string
}

export interface GasComposition {
    H2O: number
    CO2: number
    O2: number
    N2: number
    CH4: number
    N2O: number
    CO: number
    O3: number
    SO2: number
    NH3: number
    C2H6: number
    NO2: number
}

export interface PlanetData {
    planetType: PlanetType
    radiationLevel: RadiationLevel
    gasComposition: GasComposition
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