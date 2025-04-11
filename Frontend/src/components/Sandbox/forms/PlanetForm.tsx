import React from 'react';

type PlanetFormProps = {
    planetColor: string;
    setPlanetColor: (color: string) => void;
    planetSize: number;
    setPlanetSize: (size: number) => void;
    planetDistance: number;
    setPlanetDistance: (distance: number) => void;
    planetSpeed: number;
    setPlanetSpeed: (speed: number) => void;
};

const PlanetForm: React.FC<PlanetFormProps> = ({
    planetColor,
    setPlanetColor,
    planetSize,
    setPlanetSize,
    planetDistance,
    setPlanetDistance,
    planetSpeed,
    setPlanetSpeed
}) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginBottom: "10px"
            }}
        >
            <h3>Planet Properties</h3>
            <label>Planet Color: </label>
            <input
                type="color"
                value={planetColor}
                onChange={(e) => setPlanetColor(e.target.value)}
                style={{ marginBottom: "10px" }}
            />

            <label>Planet Size: </label>
            <input
                type="number"
                min="0.5"
                max="3"
                step="0.1"
                value={planetSize}
                onChange={(e) => setPlanetSize(Number(e.target.value))}
                style={{ marginBottom: "10px" }}
            />

            <label>Orbit Distance (AU): </label>
            <input
                type="number"
                min="1"
                step="0.5"
                value={planetDistance}
                onChange={(e) => setPlanetDistance(Number(e.target.value))}
                style={{ marginBottom: "10px" }}
            />

            <label>Revolution Speed: </label>
            <input
                type="number"
                min="0.001"
                max="0.1"
                step="0.001"
                value={planetSpeed}
                onChange={(e) => setPlanetSpeed(Number(e.target.value))}
                style={{ marginBottom: "10px" }}
            />
        </div>
    );
};

export default PlanetForm;