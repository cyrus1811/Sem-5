import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import { Html, Text } from "@react-three/drei";
import { gsap } from "gsap";
import { SandboxPlanetData } from "@/types/types";
import * as THREE from "three";

interface PlanetProps {
    planetData: SandboxPlanetData;
    index: number;
    updatePlanetPosition: (index: number, x: number, z: number) => void;
    onPlanetClick: (id: number) => void;
    isSelected: boolean;
}

const Planet: React.FC<PlanetProps> = ({
    planetData,
    index,
    updatePlanetPosition,
    onPlanetClick,
    isSelected,
}) => {
    const {
        id,
        color,
        size,
        distance,
        speed,
        moons,
        stars,
        hasRings,
        ringColor,
        ringInnerRadius,
        ringOuterRadius,
    } = planetData;

    const planetRef = useRef<THREE.Mesh>(null);
    const planetOrbitRef = useRef<THREE.Group>(null);
    const ringsRef = useRef<THREE.Mesh>(null);
    const moonOrbitRef = useRef<THREE.Group>(null);
    const starOrbitRef = useRef<THREE.Group>(null);
    const textRef = useRef<THREE.Group>(null);
    const orbitTrailRef = useRef<THREE.Line>(null);
    
    const [hovered, setHovered] = useState(false);
    const [orbitAngle, setOrbitAngle] = useState(Math.random() * Math.PI * 2);

    // Animation springs
    const { planetScale } = useSpring({
        planetScale: hovered || isSelected ? [1.2, 1.2, 1.2] : [1, 1, 1],
        config: { tension: 300, friction: 10 }
    });

    const { emissiveIntensity } = useSpring({
        emissiveIntensity: hovered || isSelected ? 0.5 : 0.2,
        config: { duration: 300 }
    });

    // Create orbit trail
    useEffect(() => {
        if (orbitTrailRef.current) {
            // GSAP animation for orbit trail
            gsap.to(orbitTrailRef.current.material, {
                opacity: isSelected ? 0.8 : 0.3,
                duration: 0.5
            });
        }
    }, [isSelected]);

    // Show planet name on hover
    useEffect(() => {
        if (textRef.current) {
            gsap.to(textRef.current.position, {
                y: hovered ? size + 0.5 : size + 0.3,
                duration: 0.3
            });
            
            gsap.to(textRef.current.scale, {
                x: hovered ? 1.2 : 1,
                y: hovered ? 1.2 : 1,
                z: hovered ? 1.2 : 1,
                duration: 0.3
            });
        }
    }, [hovered, size]);

    // Rotation animation for selected planet
    useEffect(() => {
        if (planetRef.current && isSelected) {
            gsap.to(planetRef.current.rotation, {
                y: planetRef.current.rotation.y + Math.PI * 2,
                duration: 2,
                ease: "power1.inOut"
            });
        }
    }, [isSelected]);

    // Main animation loop for orbital motion
    useFrame((_, delta) => {
        if (planetOrbitRef.current) {
            // Update orbit angle
            setOrbitAngle((prev) => prev + speed * delta);
            
            // Calculate new position
            const x = Math.cos(orbitAngle) * distance;
            const z = Math.sin(orbitAngle) * distance;
            
            // Update planet position
            planetOrbitRef.current.position.x = x;
            planetOrbitRef.current.position.z = z;
            
            // Update position data for collision detection
            updatePlanetPosition(index, x, z);
        }

        // Rotate planet on its axis
        if (planetRef.current) {
            planetRef.current.rotation.y += delta * 0.5;
        }

        // Rotate moons around planet
        if (moonOrbitRef.current && moons.length > 0) {
            moonOrbitRef.current.rotation.y += delta * moons[0].speed * 5;
        }

        // Rotate stars around planet
        if (starOrbitRef.current && stars.length > 0) {
            starOrbitRef.current.rotation.y -= delta * stars[0].speed * 3;
        }

        // Rotate rings
        if (ringsRef.current && hasRings) {
            ringsRef.current.rotation.z += delta * 0.1;
        }
    });

    // Create orbital path
    const createOrbitPath = () => {
        const points = [];
        const segments = 64;
        
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;
            points.push(new THREE.Vector3(x, 0, z));
        }
        
        return new THREE.BufferGeometry().setFromPoints(points);
    };

    return (
        <>
            {/* Orbit path */}
            <line ref={orbitTrailRef} geometry={createOrbitPath()}>
                <lineBasicMaterial attach="material" color={color} transparent opacity={0.3} />
            </line>
            
            {/* Planet group that orbits around central star */}
            <group ref={planetOrbitRef}>
                {/* Planet */}
                <animated.mesh
                    ref={planetRef}
                    scale={planetScale.to((x, y, z) => [x, y, z])}
                    onClick={() => onPlanetClick(id)}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                >
                    <sphereGeometry args={[size, 32, 32]} />
                    <animated.meshStandardMaterial 
                        color={color} 
                        emissive={color} 
                        emissiveIntensity={emissiveIntensity} 
                        metalness={0.4}
                        roughness={0.7}
                    />
                    
                    {/* Selection wireframe */}
                    {isSelected && (
                        <mesh>
                            <sphereGeometry args={[size * 1.05, 16, 16]} />
                            <meshBasicMaterial color="white" wireframe transparent opacity={0.3} />
                        </mesh>
                    )}
                </animated.mesh>
                
                {/* Planet name */}
                <group ref={textRef} position={[0, size + 0.3, 0]}>
                    <Text
                        color="white"
                        fontSize={0.2}
                        anchorX="center"
                        anchorY="middle"
                    >
                        {`Planet #${id}`}
                    </Text>
                </group>
                
                {/* Planet details on hover */}
                {hovered && (
                    <Html
                        position={[0, -size - 0.5, 0]}
                        center
                        distanceFactor={10}
                        occlude={false}
                    >
                        <div className="bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                            {`Size: ${size.toFixed(1)} | Speed: ${speed.toFixed(3)}`}
                        </div>
                    </Html>
                )}
                
                {/* Rings */}
                {hasRings && (
                    <group>
                        <mesh ref={ringsRef} rotation={[Math.PI / 2, 0, 0]}>
                            <ringGeometry args={[ringInnerRadius * size, ringOuterRadius * size, 64]} />
                            <meshStandardMaterial 
                                color={ringColor} 
                                side={THREE.DoubleSide} 
                                transparent 
                                opacity={0.8}
                            />
                        </mesh>
                    </group>
                )}
                
                {/* Moons */}
                {moons.length > 0 && (
                    <group ref={moonOrbitRef}>
                        <mesh position={[moons[0].distance * size, 0, 0]}>
                            <sphereGeometry args={[moons[0].size * size, 16, 16]} />
                            <meshStandardMaterial 
                                color={moons[0].color} 
                                roughness={0.8} 
                                metalness={0.2}
                            />
                        </mesh>
                    </group>
                )}
                
                {/* Stars */}
                {stars.length > 0 && (
                    <group ref={starOrbitRef}>
                        <mesh position={[0, 0, stars[0].distance * size]}>
                            <sphereGeometry args={[stars[0].size * size, 16, 16]} />
                            <meshStandardMaterial 
                                color={stars[0].color} 
                                emissive={stars[0].color} 
                                emissiveIntensity={1} 
                            />
                            
                            {/* Glow effect for stars */}
                            <mesh>
                                <sphereGeometry args={[stars[0].size * size * 1.2, 16, 16]} />
                                <meshBasicMaterial 
                                    color={stars[0].color} 
                                    transparent 
                                    opacity={0.3} 
                                />
                            </mesh>
                        </mesh>
                    </group>
                )}
            </group>
        </>
    );
};

export default Planet;