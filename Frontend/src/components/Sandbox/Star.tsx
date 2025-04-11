import React from 'react';

type StarProps = {
    size: number;
    color: string;
};

const Star: React.FC<StarProps> = ({ size, color }) => {
    return (
        <mesh position={[0, 0, 0]} scale={[size, size, size]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial
                emissive={color}
                emissiveIntensity={3} // Enhanced glowing effect
            />
        </mesh>
    );
};

export default Star;