import React from 'react';

type RingFormProps = {
    hasRings: boolean;
    setHasRings: (hasRings: boolean) => void;
    ringColor: string;
    setRingColor: (color: string) => void;
    ringSize: number;
    setRingSize: (size: number) => void;
    ringInnerRadius: number;
    setRingInnerRadius: (radius: number) => void;
    ringOuterRadius: number;
    setRingOuterRadius: (radius: number) => void;
};

const RingForm: React.FC<RingFormProps> = ({
    hasRings,
    setHasRings,
    ringColor,
    setRingColor,
    ringSize,
    setRingSize,
    ringInnerRadius,
    setRingInnerRadius,
    ringOuterRadius,
    setRingOuterRadius
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
            <h3>Ring Properties</h3>
            <label>Has Rings? </label>
            <input
                type="checkbox"
                checked={hasRings}
                onChange={() => setHasRings(!hasRings)}
                style={{ marginBottom: "10px" }}
            />

            {hasRings && (
                <>
                    <label>Ring Color: </label>
                    <input
                        type="color"
                        value={ringColor}
                        onChange={(e) => setRingColor(e.target.value)}
                        style={{ marginBottom: "10px" }}
                    />

                    <label>Ring Size: </label>
                    <input
                        type="number"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={ringSize}
                        onChange={(e) => setRingSize(Number(e.target.value))}
                        style={{ marginBottom: "10px" }}
                    />

                    <label>Ring Inner Radius: </label>
                    <input
                        type="number"
                        min="1"
                        step="0.5"
                        value={ringInnerRadius}
                        onChange={(e) => setRingInnerRadius(Number(e.target.value))}
                        style={{ marginBottom: "10px" }}
                    />

                    <label>Ring Outer Radius: </label>
                    <input
                        type="number"
                        min="1.5"
                        step="0.5"
                        value={ringOuterRadius}
                        onChange={(e) => setRingOuterRadius(Number(e.target.value))}
                        style={{ marginBottom: "10px" }}
                    />
                </>
            )}
        </div>
    );
};

export default RingForm;