import React from 'react';

type PlanetRingsProps = {
    size: number;
    innerRadius: number;
    outerRadius: number;
    color: string;
};

const PlanetRings: React.FC<PlanetRingsProps> = ({
    size,
    outerRadius,
    color,
}) => {
    return (
        <mesh>
            <torusGeometry args={[outerRadius, size, 16, 100]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
};

export default PlanetRings;