import React from 'react';

type MoonFormProps = {
    moonColor: string;
    setMoonColor: (color: string) => void;
    moonSize: number;
    setMoonSize: (size: number) => void;
    moonDistance: number;
    setMoonDistance: (distance: number) => void;
    moonSpeed: number;
    setMoonSpeed: (speed: number) => void;
};

const MoonForm: React.FC<MoonFormProps> = ({
    moonColor,
    setMoonColor,
    moonSize,
    setMoonSize,
    moonDistance,
    setMoonDistance,
    moonSpeed,
    setMoonSpeed
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
            <h3>Moon Properties</h3>
            <label>Moon Color: </label>
            <input
                type="color"
                value={moonColor}
                onChange={(e) => setMoonColor(e.target.value)}
                style={{ marginBottom: "10px" }}
            />

            <label>Moon Size: </label>
            <input
                type="number"
                min="0.1"
                max="1"
                step="0.1"
                value={moonSize}
                onChange={(e) => setMoonSize(Number(e.target.value))}
                style={{ marginBottom: "10px" }}
            />

            <label>Moon Orbit Distance: </label>
            <input
                type="number"
                min="0.5"
                step="0.1"
                value={moonDistance}
                onChange={(e) => setMoonDistance(Number(e.target.value))}
                style={{ marginBottom: "10px" }}
            />

            <label>Moon Revolution Speed: </label>
            <input
                type="number"
                min="0.001"
                max="0.1"
                step="0.001"
                value={moonSpeed}
                onChange={(e) => setMoonSpeed(Number(e.target.value))}
                style={{ marginBottom: "10px" }}
            />
        </div>
    );
};

export default MoonForm;