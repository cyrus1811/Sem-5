import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PlanetPositionData } from "@/types/types";

type AsteroidProps = {
    position: [number, number, number];
    velocity: [number, number, number];
    planets: PlanetPositionData[];
    onImpact: (id: number) => void;
    id: number;
};

const Asteroid: React.FC<AsteroidProps> = ({
    position,
    velocity,
    planets,
    onImpact,
    id,
}) => {
    const asteroidRef = useRef<any>(null);

    useFrame(() => {
        if (!asteroidRef.current) return;

        const [x, y, z] = asteroidRef.current.position.toArray();
        const newPos: [number, number, number] = [
            x + velocity[0],
            y + velocity[1],
            z + velocity[2],
        ];

        asteroidRef.current.position.set(...newPos);

        // Check collision with each planet
        for (const planet of planets) {
            const distance = Math.sqrt(
                (newPos[0] - planet.x) ** 2 + (newPos[2] - planet.z) ** 2
            );

            if (distance < planet.size * 1.2) {
                console.log(`Asteroid ${id} collided with planet at position (${planet.x}, ${planet.z})!`);
                onImpact(id);
                break;
            }
        }
    });

    return (
        <mesh ref={asteroidRef} position={position} scale={[0.3, 0.3, 0.3]}>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshStandardMaterial color="white" emissive="white" emissiveIntensity={1} />
        </mesh>
    );
};

export default Asteroid;