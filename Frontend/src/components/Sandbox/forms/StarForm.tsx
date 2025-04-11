import React from 'react';

type StarFormProps = {
    starColor: string;
    setStarColor: (color: string) => void;
    starSize: number;
    setStarSize: (size: number) => void;
    starDistance: number;
    setStarDistance: (distance: number) => void;
    starSpeed: number;
    setStarSpeed: (speed: number) => void;
};

const StarForm: React.FC<StarFormProps> = ({
    starColor,
    setStarColor,
    starSize,
    setStarSize,
    starDistance,
    setStarDistance,
    starSpeed,
    setStarSpeed
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
            <h3>Orbiting Star Properties</h3>
            <label>Star Color: </label>
            <input
                type="color"
                value={starColor}
                onChange={(e) => setStarColor(e.target.value)}
                style={{ marginBottom: "10px" }}
            />

            <label>Star Size: </label>
            <input
                type="number"
                min="0.1"
                max="1"
                step="0.1"
                value={starSize}
                onChange={(e) => setStarSize(Number(e.target.value))}
                style={{ marginBottom: "10px" }}
            />

            <label>Star Orbit Distance: </label>
            <input
                type="number"
                min="1"
                step="0.1"
                value={starDistance}
                onChange={(e) => setStarDistance(Number(e.target.value))}
                style={{ marginBottom: "10px" }}
            />

            <label>Star Revolution Speed: </label>
            <input
                type="number"
                min="0.001"
                max="0.1"
                step="0.001"
                value={starSpeed}
                onChange={(e) => setStarSpeed(Number(e.target.value))}
                style={{ marginBottom: "10px" }}
            />
        </div>
    );
};

export default StarForm;