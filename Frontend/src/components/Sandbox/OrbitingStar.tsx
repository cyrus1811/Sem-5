import React, { useState } from "react";
import { useFrame } from "@react-three/fiber";

type OrbitingStarProps = {
    distance: number;
    size: number;
    color: string;
    speed: number;
};

const OrbitingStar: React.FC<OrbitingStarProps> = ({
    distance,
    size,
    color,
    speed,
}) => {
    const [angle, setAngle] = useState(0);

    // Simulate revolution of the orbiting star around the planet
    useFrame(() => {
        setAngle((prev) => prev + speed);
    });

    // Calculate the position of the star along the orbit
    const x = distance * Math.cos(angle);
    const z = distance * Math.sin(angle);

    return (
        <mesh position={[x, 0, z]} scale={[size, size, size]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
};

export default OrbitingStar;