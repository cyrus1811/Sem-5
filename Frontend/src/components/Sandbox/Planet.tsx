import React, { useRef, useState } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { SandboxPlanetData } from "@/types/types";
import OrbitingStar from "./OrbitingStar";
import PlanetRings from "./PlanetRings";

type PlanetProps = {
    planetData: SandboxPlanetData;
    updatePlanetPosition: (index: number, x: number, z: number) => void;
    index: number;
    onPlanetClick: (id: number) => void;
    isSelected: boolean;
};

const Planet: React.FC<PlanetProps> = ({
    planetData,
    updatePlanetPosition,
    index,
    onPlanetClick,
    isSelected,
}) => {
    const { id, color, size, distance, speed, moons, stars, hasRings, ringSize, ringColor, ringInnerRadius, ringOuterRadius } = planetData;
    const meshRef = useRef<any>(null);
    const [angle, setAngle] = useState(0);

    // Simulate planet revolution
    useFrame(() => {
        setAngle((prev) => prev + speed);

        // Calculate the position of the planet along the orbit
        const x = distance * Math.cos(angle);
        const z = distance * Math.sin(angle);

        // Update planet position in parent component for collision detection
        updatePlanetPosition(index, x, z);

        if (meshRef.current) {
            meshRef.current.position.set(x, 0, z);
        }
    });

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onPlanetClick(id);
    };

    return (
        <mesh
            ref={meshRef}
            scale={[size, size, size]}
            onClick={handleClick}
            onPointerOver={(_e) => document.body.style.cursor = 'pointer'}
            onPointerOut={(_e) => document.body.style.cursor = 'auto'}
        >
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial
                color={color}
                emissive={isSelected ? "white" : "black"}
                emissiveIntensity={isSelected ? 0.2 : 0}
                wireframe={isSelected}
            />

            {/* Render Moons */}
            {moons.map((moon, idx) => {
                const moonAngle = angle * moon.speed;
                const moonX = moon.distance * Math.cos(moonAngle);
                const moonZ = moon.distance * Math.sin(moonAngle);

                return (
                    <mesh
                        key={idx}
                        position={[moonX, 0, moonZ]}
                        scale={[moon.size, moon.size, moon.size]}
                    >
                        <sphereGeometry args={[1, 32, 32]} />
                        <meshStandardMaterial color={moon.color} />
                    </mesh>
                );
            })}

            {/* Render Orbiting Stars */}
            {stars.map((star, idx) => (
                <OrbitingStar
                    key={idx}
                    distance={star.distance}
                    size={star.size}
                    color={star.color}
                    speed={star.speed}
                />
            ))}

            {/* Render Rings for Saturn or other planets */}
            {hasRings && (
                <PlanetRings
                    size={ringSize}
                    innerRadius={ringInnerRadius}
                    outerRadius={ringOuterRadius}
                    color={ringColor}
                />
            )}
        </mesh>
    );
};

export default Planet;